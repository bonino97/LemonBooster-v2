'use strict'

//MODELS 

const Programs = require('../Models/Programs');

//LIBRARIES
require('dotenv').config({path: '.env'});
const shell = require('shelljs');
const fs = require('fs');
const { PaginatedResultsByScope } = require('../Helpers/PaginatedResult');

//CONSTANTS
const RESULTS_DIR = process.env.RESULTS_DIR;

//=====================================================================
// Obtain all Programs
//=====================================================================

exports.GetPrograms = async (req,res) => {
    try {
        await Programs.find({})
        .exec((err,programs) => {
            if(err){
                return res.status(400).json({
                    success: false,
                    msg: 'Error loading programs.',
                    errors: err
                });
            }

            if(programs.length === 0){
                return res.status(404).json({
                    success: false,
                    msg: `You haven't got programs.`
                });
            }

            return res.status(200).json({
                success: true,
                data: programs
            });
        });
    } catch (e) {
        console.error(e);
        return res.status(400).json({
            success: false,
            msg: e.message
        });
    }
}

//=====================================================================
// Obtain one Programs by Url
//=====================================================================


exports.GetProgram = async (req,res) => {
    try{
        const url = req.params.url;

        await Programs.findOne({Url: url}, (err, program) => {
            if(err){
                return res.status(400).json({
                    success: false,
                    msg: 'Error getting program.',
                    errors: err 
                });
            }

            if(!program){
                return res.status(404).json({
                    success: false,
                    msg: `Doesn't exist program with this URL.` 
                });
            }

            return res.status(200).json({
                success:true,
                data: program
            });
        });

    } catch (e) {
        console.error(e);
        return res.status(400).json({
            success: false,
            msg: e.message
        });
    }
    
}

//=====================================================================
// Add new Programs
//=====================================================================

exports.AddProgram = async (req,res) => {
    try{
        const body = req.body;
        const programDir = `${RESULTS_DIR}${body.Name}/`;
    
        const program = new Programs({
            Name: body.Name,
            Scopes: body.Scopes,
            Directory: programDir,
        });
        
        if(!fs.existsSync(RESULTS_DIR)){
            shell.exec(`mkdir ${RESULTS_DIR}`);
        } else { 
            console.log('Results Directory Exists.');
        }
    
        if(!fs.existsSync(program.Directory) ){
            shell.exec(`mkdir ${program.Directory}`)
        } else { 
            console.log('Programs Directory Exists.');
        }
    
        program.save((err,programSaved) => {
            
            if(err){
                return res.status(400).json({
                    success: false,
                    msg: 'Error saving program.',
                    errors: err 
                });
            }
    
            return res.status(200).json({
                success:true,
                data: programSaved,
                msg: `Programs ${programSaved.Name} created successfully...`
            });
        });
    } catch(e) {
        console.error(e);
        return res.status(400).json({
            success: false,
            msg: e.message
        });
    }
}


//=====================================================================
// Remove Programs
//=====================================================================

exports.RemoveProgram = async (req,res) => {
    try{
        var id = req.params.id;

        await Programs.findByIdAndRemove(id, (err,removedProgram) => {
        
            if(err){
                return res.status(400).json({
                    success: false,
                    msg: 'An error ocurred removing program.',
                    errors: err 
                });
            }
    
            if(!removedProgram){
                return res.status(404).json({
                    success: false,
                    msg: 'Doesnt exist a program with this id.' 
                });
            }
    
            return res.status(200).json({
                success: true,
                msg: `Programs: ${removedProgram.Name} removed successfully...` 
            });
        });

    } catch(e){
        console.error(e);
        return res.status(400).json({
            success: false,
            msg: e.message
        });
    }
}

//=====================================================================
// Edit Programs
//=====================================================================

exports.EditProgram = async (req,res) => {
    try{
        const body = req.body; 
        
        await Programs.findOneAndUpdate(
            {Url: req.params.url},
            body,
            {new: true, runValidators: true}, 
            (err, updatedProgram) => {

            if(err){
                return res.status(400).json({
                    success: false,
                    msg: 'An error ocurred updating program.',
                    errors: err 
                });
            }

            if(!updatedProgram){
                return res.status(404).json({
                    success: false,
                    msg: 'Doesnt exist a program with this URL.' 
                });
            }

            return res.status(200).json({
                success: true,
                data: updatedProgram,
                msg: `Programs ${updatedProgram.Name} updated successfully...`
            });
        });

    } catch(e) {
        console.error(e);
        return res.status(400).json({
            success: false,
            msg: e.message
        });
    }
}

exports.GetSubdomainsByScope = async (req,res) => {

    try{
        
        const program = await Programs.findOne({Url: req.params.url});
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const scope = req.query.scope;
        const filter = req.query.filter;

        const programs = await PaginatedResultsByScope(program.Subdomains, page, limit, scope, filter);

        return res.status(200).json(programs);

    } catch(e) {
        console.error(e);
        return res.status(400).json({
            success: false,
            msg: e.message
        });
    }

}