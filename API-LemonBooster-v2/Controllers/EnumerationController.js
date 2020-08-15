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


exports.GetEnumeration = async (req,res) => {
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
            Program: program
        }); 

        enumeration.save();
        console.log(enumeration);

        return res.status(200).json({
            success:true,
            data: enumeration
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

function CreateSubdomainEnumerationDirectory(Program){

    const SUB_ENUMERATION_DIR = `${CreateEnumerationDirectory(Program)}Subdomains`;

    if(!fs.existsSync(SUB_ENUMERATION_DIR) ){
        shell.exec(`mkdir ${SUB_ENUMERATION_DIR}`);
    }
    
    return SUB_ENUMERATION_DIR;
}

