'use strict'

//LIBRARIES 

const shell = require('shelljs');
const fs = require('fs');

//MODELS

const Program = require('../Models/Programs');
const Monitorings = require('../Models/Monitorings');



//CONSTANTS
require('dotenv').config({path: '.env'});

const { PaginatedResultsByScope, PaginatedResponseCodesByScope } = require('../Helpers/PaginatedResult');

exports.GetSubdomainsMonitoring = async (req,res) => {
    try{
        
        const program = await Program.findOne({Url: req.params.url});
        const monitoring = await Monitorings.find({Program: program._id, Scope: req.query.scope, Type: 1});

        console.log(monitoring);
        // const page = parseInt(req.query.page);
        // const limit = parseInt(req.query.limit);
        // const scope = req.query.scope;
        // const filter = req.query.filter;

        // const programs = await PaginatedResultsByScope(program.Subdomains, page, limit, scope, filter);

        return res.status(200).json(programs);

    } catch(e) {
        console.error(e);
        return res.status(400).json({
            success: false,
            msg: e.message
        });
    }

}