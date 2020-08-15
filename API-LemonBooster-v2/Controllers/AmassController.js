'use strict'

//LIBRARIES 

const shell = require('shelljs');
const dateFormat = require('dateformat');
const fs = require('fs');


//MODELS

const Program = require('../Models/Programs');
const Amass = require('../Models/Amass');

//CONSTS

const date = dateFormat(new Date(), "yyyy-mm-dd-HH-MM");

//=====================================================================
// Obtain Program by Url and create Amass Instance.
//=====================================================================


exports.GetAmass = async (req,res) => {
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

exports.ExecuteAmassWithASNs = async (req,res) => {
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

        const amass = new Amass({
            Program: program, 
            Directory: CreateAmassDirectory(program),
            ASNs: body.ASNs,
            Syntax: `amass intel -asn ${body.ASNs.toString()}`
        }); 


        amass.save();

        return res.status(200).json({
            success:true,
            data: amass
        });
    });

}

exports.ExecuteAmassWithCIDRs = async (req,res) => {
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

        const amass = new Amass({
            Program: program, 
            Directory: CreateAmassDirectory(program),
            CIDRs: body.CIDRs,
            Syntax: `amass intel -cidr ${body.CIDRs.toString()}`
        }); 


        amass.save();

        return res.status(200).json({
            success:true,
            data: amass
        });
    });

}




/* ########################################################### */
/* ##################===FUNCTIONS===########################## */
/* ########################################################### */

function CreateAmassDirectory(Program){

    const AMASS_DIR = `${Program.Directory}Amass`;

    if(!fs.existsSync(AMASS_DIR) ){
        shell.exec(`mkdir ${AMASS_DIR}`);
    }
    return AMASS_DIR;
}