'use strict'

//LIBRARIES 

const shell = require('shelljs');
const fs = require('fs');

//MODELS

const Program = require('../Models/Programs');
const Enumerations = require('../Models/Enumerations');

const { PaginatedResultsByScope, PaginatedResponseCodesByScope } = require('../Helpers/PaginatedResult');


//CONSTANTS
require('dotenv').config({path: '.env'});


//=====================================================================
// Obtain Program by Url and create Enumeration Instance.
//=====================================================================


exports.GetEnumerationProgram = async (req,res) => {
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

exports.ExecuteSubdomainEnumeration = async (req,res) => {

    const body = req.body;
    const url = req.params.url;
    
    try {
        const program = await Program.findOne({Url: url});
        if(!program){
            return res.status(404).json({
                success: false,
                msg: `Doesn't exist program with this URL.` 
            });
        }

        const enumeration = new Enumerations({
            Directory: CreateSubdomainEnumerationDirectory(program),
            Scope: body.Scope,
            Program: program._id,
            Type: 1, // Tipo 1 = Subdomain Enumeration.
            Executed: false
        });


        enumeration.save();

        return res.status(200).json({
            success:true,
            data: enumeration
        });

    } catch (err) {
        if(err){
            return res.status(400).json({
                success: false,
                msg: 'Error getting program.',
                errors: err 
            });
        }
    }
}

exports.GetSubdomainsByScope = async (req,res) => {

    try{
        
        const program = await Program.findOne({Url: req.params.url});
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

exports.ExecuteAlive = async (req,res) => {
    const body = req.body;
    const url = req.params.url;
    try {
        const program = await Program.findOne({Url: url});
        if(!program){
            return res.status(404).json({
                success: false,
                msg: `Doesn't exist program with this URL.` 
            });
        }
    
        const subdomainEnumeration = await Enumerations.findOne({Program: program._id, Type: 1, Scope: req.body.Scope, Executed: true});
    
        if(!subdomainEnumeration) {
            return res.status(404).json({
                success: false,
                msg: `You must execute Subdomain enumeration for this Scope first.` 
            });
        }
    
        const enumeration = new Enumerations({
            Directory: CreateAliveDirectory(program),
            Scope: body.Scope,
            Program: program._id,
            Type: 2, // Tipo 2 = Alive Enumeration.
            Executed: false
        });
    
        enumeration.save();
    
        return res.status(200).json({
            success:true,
            data: enumeration,
            subdomain: subdomainEnumeration
        });
    } catch(err) {
        if(err){
            return res.status(400).json({
                success: false,
                msg: 'Error getting program.',
                errors: err 
            });
        }
    }
}

exports.GetAlivesByScope = async (req,res) => {

    try{
        
        const program = await Program.findOne({Url: req.params.url});
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const scope = req.query.scope;
        const filter = req.query.filter;
        const alives = await PaginatedResultsByScope(program.Alives, page, limit, scope, filter);
        
        return res.status(200).json(alives);

    } catch(e) {
        console.error(e);
        return res.status(400).json({
            success: false,
            msg: e.message
        });
    }

}

exports.ExecuteScreenshots = async (req,res) => {
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
                msg: `You must execute Alive enumeration for this Scope first.` 
            });
        }
        
        const executedEnumeration = await Enumerations.findOne({Program: program._id, Type: 3, Scope: body.Scope});
    
        if(executedEnumeration) {
            shell.exec(`rm -r ${executedEnumeration.Directory}`);
            await executedEnumeration.remove();
        }
    
        const enumeration = new Enumerations({
            Directory: CreateScreenshotDirectory(program, body.Scope),
            Scope: body.Scope,
            Program: program,
            Type: 3, // Tipo 3 = Screenshots.
            Executed: false
        });
    
        enumeration.save();
    
        return res.status(200).json({
            success:true,
            data: enumeration,
            alives: alives
        });
    } catch (err) {
        if(err){
            return res.status(400).json({
                success: false,
                msg: 'Error getting program.',
                errors: err 
            });
        }
    }
}

exports.GetScreenshotsByScope = async (req,res) => {

    const url = req.params.url;
    const scope = req.query.scope;

    try {
        const program = await Program.findOne({Url: url}).exec();
        const enumeration = await Enumerations.findOne({Scope: scope, Program: program._id, Type: 3, Executed: true}).exec();
        
        if(!enumeration){
            return res.status(404).json({
                success: false,
                msg: `Doesn't exists Screenshots for this Scope.` 
            });
        }
    
        return res.status(200).json({
            success:true,
            data: enumeration
        });

    } catch (err) {
        if(err){
            return res.status(400).json({
                success: false,
                msg: 'Error screenshots.',
                errors: err 
            });
        }
    }
}

exports.ExecuteJSScanner = async (req,res) => {
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
        
        const executedEnumeration = await Enumerations.findOne({Program: program._id, Type: 4, Scope: body.Scope, Subdomain: body.Subdomain, Executed: true});
        
        if(executedEnumeration) {
            shell.exec(`rm -r ${executedEnumeration.File}`);
            await executedEnumeration.remove();
        }

        const enumeration = new Enumerations({
            Directory: CreateJSResultsDirectory(program, body.Scope),
            Scope: body.Scope,
            Program: program._id,
            Type: 4, // Tipo 4 = JSScanning.
            Executed: false,
            Subdomain: body.Subdomain
        });
    
        enumeration.save();
    
        return res.status(200).json({
            success:true,
            data: enumeration
        });

    } catch ( err ) {
        if(err){
            return res.status(400).json({
                success: false,
                msg: 'Error getting program.',
                errors: err 
            });
        }
    }
}

exports.GetJSFileBySubdomain = async (req,res) => {

    const url = req.params.url;
    const subdomain = req.query.subdomain;
    const scope = req.query.scope;

    try {
        const program = await Program.findOne({Url: url}).exec();
        const enumeration = await Enumerations.findOne({Program: program._id, Type: 4, Scope: scope, Subdomain: subdomain, Executed: true});

        if(!enumeration){
            return res.status(404).json({
                success: false,
                msg: `Doesn't exists JS Scans for this Subdomain.` 
            });
        }
    
        return res.status(200).json({
            success:true,
            data: enumeration
        });

    } catch (err) {
        if(err){
            return res.status(400).json({
                success: false,
                msg: 'Error JS Scans.',
                errors: err 
            });
        }
    }
}

exports.ExecuteSubdomainResponseCodes = async (req,res) => {
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

        const enumeration = new Enumerations({
            Directory: CreateResponseCodesDirectory(program),
            Scope: body.Scope,
            Program: program._id,
            Type: 5, // Tipo 5 = Response Code Scanning.
            Executed: false
        });
    
        enumeration.save();
    
        return res.status(200).json({
            success:true,
            data: enumeration,
            alives: alives
        });

    } catch ( err ) {
        if(err){
            return res.status(400).json({
                success: false,
                msg: 'Error getting program.',
                errors: err 
            });
        }
    }
}

exports.GetResponseCodesSubdomainsByScope = async (req,res) => {
    try{
        
        const program = await Program.findOne({Url: req.params.url});
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const scope = req.query.scope;
        const filter = req.query.filter;
        const responseCodes = await PaginatedResponseCodesByScope(program.ResponseCodes, page, limit, scope, filter);
        
        return res.status(200).json(responseCodes);

    } catch(e) {
        console.error(e);
        return res.status(400).json({
            success: false,
            msg: e.message
        });
    }
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

function CreateScreenshotDirectory(Program, Scope){

    const SCREENSHOT_DIR = `${Program.PathDirectory}Screenshots/`;

    if(!fs.existsSync(SCREENSHOT_DIR) ){
        shell.exec(`mkdir ${SCREENSHOT_DIR}`);
    }

    const SCREENSHOT_SCOPE_DIR = `${SCREENSHOT_DIR}${Scope.toUpperCase()}`;

    if(!fs.existsSync(SCREENSHOT_SCOPE_DIR) ){
        shell.exec(`mkdir ${SCREENSHOT_SCOPE_DIR}`);
    }
    
    return SCREENSHOT_SCOPE_DIR;
}

function CreateJSResultsDirectory(Program, Scope){

    const JS_DIR = `${Program.Directory}JSResults/`;

    if(!fs.existsSync(JS_DIR) ){
        shell.exec(`mkdir ${JS_DIR}`);
    }

    const JS_SCOPE_DIR = `${JS_DIR}${Scope.toUpperCase()}`;

    if(!fs.existsSync(JS_SCOPE_DIR) ){
        shell.exec(`mkdir ${JS_SCOPE_DIR}`);
    }
    
    return JS_SCOPE_DIR;
}

function CreateSubdomainEnumerationDirectory(Program){

    const SUB_ENUMERATION_DIR = `${CreateEnumerationDirectory(Program)}Subdomains`;

    if(!fs.existsSync(SUB_ENUMERATION_DIR) ){
        shell.exec(`mkdir ${SUB_ENUMERATION_DIR}`);
    }
    
    return SUB_ENUMERATION_DIR;
}

function CreateResponseCodesDirectory(Program){

    const RESPONSE_CODES_DIR = `${CreateEnumerationDirectory(Program)}ResponseCodes`;

    if(!fs.existsSync(RESPONSE_CODES_DIR) ){
        shell.exec(`mkdir ${RESPONSE_CODES_DIR}`);
    }
    
    return RESPONSE_CODES_DIR;
}

