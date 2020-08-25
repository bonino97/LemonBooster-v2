'use strict'

//LIBRARIES 

const shell = require('shelljs');
const dateFormat = require('dateformat');
const fs = require('fs');

//MODELS

const Program = require('../Models/Programs');
const Enumerations = require('../Models/Enumerations');
const Monitorings = require('../Models/Monitorings');
const Discoveries = require('../Models/Discoveries');

const { PaginatedResultsByScope, PaginatedResponseCodesByScope } = require('../Helpers/PaginatedResult');



//CONSTANTS
require('dotenv').config({path: '.env'});
const RESULTS_DIR = process.env.RESULTS_DIR;
const PATH_DIR = process.env.PATH_DIR;


exports.GetDiscoveryProgram = async (req,res) => {
    try{
        const url = req.params.url;
        const program = await Program.findOne({Url: url}); 

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

    } catch (e) {
        console.error(e);
        return res.status(400).json({
            success: false,
            msg: e.message
        });
    }
}

exports.ExecuteAllWaybackurls = async (req,res) => {

    const body = req.body;
    const url = req.params.url;

    try {
        const program = await Program.findOne({Url: url}).exec();
        
        if(!program){
            return res.status(404).json({
                success: false,
                msg: `Doesn't exist program with this URL.` 
            });
        }

        const alives = await Enumerations.findOne({Program: program._id, Type: 2, Scope: body.Scope, Executed: true});
    
        if(!alives) {
            return res.status(404).json({
                success: false,
                msg: `You must execute Alive enumeration for this Scanning first.` 
            });
        }

        const discovery = new Discoveries({
            Directory: CreateWaybackurlDirectory(program),
            Scope: body.Scope,
            Program: program._id,
            Type: 1, // Tipo 1 = Waybackurls.
            Executed: false
        });
    
        discovery.save();
    
        return res.status(200).json({
            success:true,
            data: discovery,
            alives: alives
        });

    } catch ( err ) {
        console.error(err);
        if(err){
            return res.status(400).json({
                success: false,
                msg: 'Error getting program.',
                errors: err 
            });
        }
    }
}

exports.ExecuteWaybackurlsBySubdomain = async (req,res) => {

    const body = req.body;
    const url = req.params.url;

    try {
        const program = await Program.findOne({Url: url}).exec();
        
        if(!program){
            return res.status(404).json({
                success: false,
                msg: `Doesn't exist program with this URL.` 
            });
        }

        const alives = await Enumerations.findOne({Program: program._id, Type: 2, Scope: body.Scope, Executed: true});
    
        if(!alives) {
            return res.status(404).json({
                success: false,
                msg: `You must execute Alive enumeration for this Scanning first.` 
            });
        }

        const discovery = new Discoveries({
            Directory: CreateWaybackurlDirectory(program),
            Scope: body.Scope,
            Program: program._id,
            Type: 2, // Tipo 2 = Waybackurl by Subdomain.
            Executed: false,
            Subdomain: body.Subdomain
        });
    
        discovery.save();
    
        return res.status(200).json({
            success:true,
            data: discovery
        });

    } catch ( err ) {
        console.error(err);
        if(err){
            return res.status(400).json({
                success: false,
                msg: 'Error getting program.',
                errors: err 
            });
        }
    }
}

function CreateDiscoveryDirectory(Program){

    const DISCOVERY_DIR = `${Program.Directory}Discovery/`;

    if(!fs.existsSync(DISCOVERY_DIR) ){
        shell.exec(`mkdir ${DISCOVERY_DIR}`);
    }

    return DISCOVERY_DIR;
}

function CreateWaybackurlDirectory(Program){

    const WAYBACKURL_DIR = `${CreateDiscoveryDirectory(Program)}Waybackurls`;

    if(!fs.existsSync(WAYBACKURL_DIR) ){
        shell.exec(`mkdir ${WAYBACKURL_DIR}`);
    }
    
    return WAYBACKURL_DIR;
}
