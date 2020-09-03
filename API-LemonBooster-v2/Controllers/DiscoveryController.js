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

exports.ExecuteAllGoSpider = async (req,res) => {

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
            Directory: CreateSpiderDirectory(program),
            Scope: body.Scope,
            Program: program._id,
            Type: 3, // Tipo 3 = Gospider.
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

exports.ExecuteGoSpiderBySubdomain = async (req,res) => {

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
            Directory: CreateSpiderDirectory(program),
            Scope: body.Scope,
            Program: program._id,
            Type: 4, // Tipo 4 = GoSpider by Subdomain.
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

exports.ExecuteAllHakrawler = async (req,res) => {

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
            Directory: CreateSpiderDirectory(program),
            Scope: body.Scope,
            Program: program._id,
            Type: 5, // Tipo 5 = Hakrawler.
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

exports.ExecuteHakrawlerBySubdomain = async (req,res) => {

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
            Directory: CreateSpiderDirectory(program),
            Scope: body.Scope,
            Program: program._id,
            Type: 6, // Tipo 6 = Hakrawler by Subdomain.
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

exports.GetDirsearchLists = async (req,res) => {
    const listsArray = [];
    const listFolder = `./Common/Lists/`;

    try{

        if(!listFolder){
            return res.status(400).json({
                ok: false,
                message: 'Wrong List Folder' ,
                error: { message: 'Wrong List Folder' }
            });
        }

        fs.readdirSync(listFolder).forEach(files => {
            listsArray.push(files);
        });
    
        return res.status(200).json({
            success: true,
            data: listsArray
        });

    }
    catch(error){
        console.log(error);
    }
}

exports.ExecuteAllDirsearch = async (req,res) => {

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
            Directory: CreateBruteforcingDirectory(program),
            Scope: body.Scope,
            Program: program._id,
            Type: 7, // Tipo 7 = Dirsearch.
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

exports.ExecuteDirsearchBySubdomain = async (req,res) => {

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
            Directory: CreateBruteforcingDirectory(program),
            Scope: body.Scope,
            Program: program._id,
            Type: 8, // Tipo 8 = Dirsearch by Subdomain.
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

function CreateSpiderDirectory(Program){

    const SPIDER_DIR = `${CreateDiscoveryDirectory(Program)}Spider`;

    if(!fs.existsSync(SPIDER_DIR) ){
        shell.exec(`mkdir ${SPIDER_DIR}`);
    }
    
    return SPIDER_DIR;
}

function CreateBruteforcingDirectory(Program){

    const BRUTEF_DIR = `${CreateDiscoveryDirectory(Program)}Bruteforcing`;

    if(!fs.existsSync(BRUTEF_DIR) ){
        shell.exec(`mkdir ${BRUTEF_DIR}`);
    }
    
    return BRUTEF_DIR;
}
