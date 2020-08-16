'use strict'

//LIBRARIES 

const shell = require('shelljs');
const dateFormat = require('dateformat');
const fs = require('fs');

//MODELS

const Program = require('../Models/Programs');
const Enumerations = require('../Models/Enumerations');

//=====================================================================
// Obtain Program by Url and create Enumeration Instance.
//=====================================================================


exports.GetEnumerationProgram = async (req,res) => {
    try{
        const url = req.params.url;

        await Program.findOne({Url: url}, (err, program) => {
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

exports.ExecuteSubdomainEnumeration = async (req,res) => {
    const body = req.body;
    const url = req.params.url;
    
    await Program.findOne({Url: url}, (err,program) => {
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

        const enumeration = new Enumerations({
            Directory: CreateSubdomainEnumerationDirectory(program),
            Scope: body.Scope,
            Program: program,
            Type: 1 // Tipo 1 = Subdomain Enumeration.
        }); 

        enumeration.save();

        return res.status(200).json({
            success:true,
            data: enumeration
        });
    });

}

exports.ExecuteAlive = async (req,res) => {
    const body = req.body;
    const url = req.params.url;
    
    await Program.findOne({Url: url}, async (err,program) => {
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

        const subdomainEnumeration = await Enumerations.findOne({Program: program._id, Type: 1, Scope: req.body.Scope});
        const enumeration = new Enumerations({
            Directory: CreateAliveDirectory(program),
            Scope: body.Scope,
            Program: program,
            Type: 2 // Tipo 2 = Alive Enumeration.
        });

        enumeration.save();

        return res.status(200).json({
            success:true,
            data: enumeration,
            subdomain: subdomainEnumeration
        });
    });
}

function CreateEnumerationDirectory(Program){

    const ENUMERATION_DIR = `${Program.Directory}Enumeration/`;

    if(!fs.existsSync(ENUMERATION_DIR) ){
        shell.exec(`mkdir ${ENUMERATION_DIR}`);
    }

    return ENUMERATION_DIR;
}

function CreateAliveDirectory(Program){

    const ALIVE_DIR = `${Program.Directory}Alive`;

    if(!fs.existsSync(ALIVE_DIR) ){
        shell.exec(`mkdir ${ALIVE_DIR}`);
    }
    
    return ALIVE_DIR;
}

function CreateSubdomainEnumerationDirectory(Program){

    const SUB_ENUMERATION_DIR = `${CreateEnumerationDirectory(Program)}Subdomains`;

    if(!fs.existsSync(SUB_ENUMERATION_DIR) ){
        shell.exec(`mkdir ${SUB_ENUMERATION_DIR}`);
    }
    
    return SUB_ENUMERATION_DIR;
}

