'use strict'

//LIBRARIES 

const shell = require('shelljs');
const dateFormat = require('dateformat');
const fs = require('fs');


//MODELS

const Program = require('../Models/Programs');
const Seeds = require('../Models/Seeds');

//CONSTS

const date = dateFormat(new Date(), "yyyy-mm-dd-HH-MM");

//=====================================================================
// Obtain Program by Url and create Seeds Instance.
//=====================================================================


exports.GetSeeds = async (req,res) => {
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

        const seeds = new Seeds({
            Program: program, 
            Directory: CreateSeedsDirectory(program),
            ASNs: body.ASNs,
            Syntax: `amass intel -asn ${body.ASNs.toString()}`
        }); 


        seeds.save();

        return res.status(200).json({
            success:true,
            data: seeds
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

        const seeds = new Seeds({
            Program: program, 
            Directory: CreateSeedsDirectory(program),
            CIDRs: body.CIDRs,
            Syntax: `amass intel -cidr ${body.CIDRs.toString()}`
        }); 


        seeds.save();

        return res.status(200).json({
            success:true,
            data: seeds
        });
    });

}




/* ########################################################### */
/* ##################===FUNCTIONS===########################## */
/* ########################################################### */

function CreateSeedsDirectory(Program){

    const SEEDS_DIR = `${Program.Directory}Seeds`;

    if(!fs.existsSync(SEEDS_DIR) ){
        shell.exec(`mkdir ${SEEDS_DIR}`);
    }
    return SEEDS_DIR;
}