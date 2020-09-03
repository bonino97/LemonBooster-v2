'use strict'

//LIBRARIES 

const shell = require('shelljs');
const dateFormat = require('dateformat');
const fs = require('fs');

//MODELS
const Program = require('../Models/Programs');
const Enumerations = require('../Models/Enumerations');
const Discoveries = require('../Models/Discoveries');

//CONSTANTS
require('dotenv').config({path: '.env'});
const RESULTS_DIR = process.env.RESULTS_DIR;
const PATH_DIR = process.env.PATH_DIR;

exports.GetSubdomainsResults = async (req,res) => {

    try {
        const program = await Program.findOne({Url: req.params.url}).exec();
        const enumeration = await Enumerations.findOne({Program: program._id, Type: 1, Executed: true, Scope: req.query.scope}).sort({'ExecutedAt': -1}).exec();

        if(!enumeration){
            return res.status(404).json({
                success: false,
                msg: 'Doesnt exist file with this Scope...'
            });
        }

        return res.status(200).json({
            success: true,
            data: enumeration
        });

    } catch (e) {
        console.error(e);
        return res.status(400).json({
            success: false,
            msg: e.message
        });
    }
}

exports.GetAlivesResults = async (req,res) => {

    try {
        const program = await Program.findOne({Url: req.params.url}).exec();
        const enumeration = await Enumerations.findOne({Program: program._id, Type: 2, Executed: true, Scope: req.query.scope}).sort({'ExecutedAt': -1}).exec();

        if(!enumeration){
            return res.status(404).json({
                success: false,
                msg: 'Doesnt exist file with this Scope...'
            });
        }

        return res.status(200).json({
            success: true,
            data: enumeration
        });

    } catch (e) {
        console.error(e);
        return res.status(400).json({
            success: false,
            msg: e.message
        });
    }
}

exports.GetResponseCodesResults = async (req,res) => {

    try {
        const program = await Program.findOne({Url: req.params.url}).exec();
        const enumeration = await Enumerations.findOne({Program: program._id, Type: 5, Executed: true, Scope: req.query.scope}).sort({'ExecutedAt': -1}).exec();

        if(!enumeration){
            return res.status(404).json({
                success: false,
                msg: 'Doesnt exist file with this Scope...'
            });
        }

        return res.status(200).json({
            success: true,
            data: enumeration
        });

    } catch (e) {
        console.error(e);
        return res.status(400).json({
            success: false,
            msg: e.message
        });
    }
}

exports.GetWaybackResults = async (req,res) => {

    try {
        const program = await Program.findOne({Url: req.params.url}).exec();
        const discoveries = await Discoveries.findOne({Program: program._id, Type: 1, Executed: true, Scope: req.query.scope}).sort({'ExecutedAt': -1}).exec();

        if(!discoveries){
            return res.status(404).json({
                success: false,
                msg: 'Doesnt exist file with this Scope...'
            });
        }

        return res.status(200).json({
            success: true,
            data: discoveries
        });

    } catch (e) {
        console.error(e);
        return res.status(400).json({
            success: false,
            msg: e.message
        });
    }
}

exports.GetWaybackBySubdomainResults = async (req,res) => {

    try {
        const program = await Program.findOne({Url: req.params.url}).exec();
        const discoveries = await Discoveries.findOne({Program: program._id, Type: 2, Executed: true, Scope: req.query.scope, Subdomain: req.query.subdomain}).sort({'ExecutedAt': -1}).exec();

        if(!discoveries){
            return res.status(404).json({
                success: false,
                msg: 'Doesnt exist file with this Scope...'
            });
        }

        return res.status(200).json({
            success: true,
            data: discoveries
        });

    } catch (e) {
        console.error(e);
        return res.status(400).json({
            success: false,
            msg: e.message
        });
    }
}

exports.GetGoSpiderResults = async (req,res) => {

    try {
        const program = await Program.findOne({Url: req.params.url}).exec();
        const discoveries = await Discoveries.findOne({Program: program._id, Type: 3, Executed: true, Scope: req.query.scope}).sort({'ExecutedAt': -1}).exec();

        if(!discoveries){
            return res.status(404).json({
                success: false,
                msg: 'Doesnt exist file with this Scope...'
            });
        }

        return res.status(200).json({
            success: true,
            data: discoveries
        });

    } catch (e) {
        console.error(e);
        return res.status(400).json({
            success: false,
            msg: e.message
        });
    }
}

exports.GetGoSpiderBySubdomainResults = async (req,res) => {

    try {
        const program = await Program.findOne({Url: req.params.url}).exec();
        const discoveries = await Discoveries.findOne({Program: program._id, Type: 4, Executed: true, Scope: req.query.scope, Subdomain: req.query.subdomain}).sort({'ExecutedAt': -1}).exec();

        if(!discoveries){
            return res.status(404).json({
                success: false,
                msg: 'Doesnt exist file with this Scope...'
            });
        }

        return res.status(200).json({
            success: true,
            data: discoveries
        });

    } catch (e) {
        console.error(e);
        return res.status(400).json({
            success: false,
            msg: e.message
        });
    }
}

exports.GetHakrawlerResults = async (req,res) => {

    try {
        const program = await Program.findOne({Url: req.params.url}).exec();
        const discoveries = await Discoveries.findOne({Program: program._id, Type: 5, Executed: true, Scope: req.query.scope}).sort({'ExecutedAt': -1}).exec();

        if(!discoveries){
            return res.status(404).json({
                success: false,
                msg: 'Doesnt exist file with this Scope...'
            });
        }

        return res.status(200).json({
            success: true,
            data: discoveries
        });

    } catch (e) {
        console.error(e);
        return res.status(400).json({
            success: false,
            msg: e.message
        });
    }
}

exports.GetHakrawlerBySubdomainResults = async (req,res) => {

    try {
        const program = await Program.findOne({Url: req.params.url}).exec();
        const discoveries = await Discoveries.findOne({Program: program._id, Type: 6, Executed: true, Scope: req.query.scope, Subdomain: req.query.subdomain}).sort({'ExecutedAt': -1}).exec();

        if(!discoveries){
            return res.status(404).json({
                success: false,
                msg: 'Doesnt exist file with this Scope...'
            });
        }

        return res.status(200).json({
            success: true,
            data: discoveries
        });

    } catch (e) {
        console.error(e);
        return res.status(400).json({
            success: false,
            msg: e.message
        });
    }
}

exports.GetDirsearchResults = async (req,res) => {

    try {
        const program = await Program.findOne({Url: req.params.url}).exec();
        const discoveries = await Discoveries.findOne({Program: program._id, Type: 7, Executed: true, Scope: req.query.scope}).sort({'ExecutedAt': -1}).exec();

        if(!discoveries){
            return res.status(404).json({
                success: false,
                msg: 'Doesnt exist file with this Scope...'
            });
        }

        return res.status(200).json({
            success: true,
            data: discoveries
        });

    } catch (e) {
        console.error(e);
        return res.status(400).json({
            success: false,
            msg: e.message
        });
    }
}

exports.GetDirsearchBySubdomainResults = async (req,res) => {

    try {
        const program = await Program.findOne({Url: req.params.url}).exec();
        const discoveries = await Discoveries.findOne({Program: program._id, Type: 8, Executed: true, Scope: req.query.scope, Subdomain: req.query.subdomain}).sort({'ExecutedAt': -1}).exec();

        if(!discoveries){
            return res.status(404).json({
                success: false,
                msg: 'Doesnt exist file with this Scope...'
            });
        }

        return res.status(200).json({
            success: true,
            data: discoveries
        });

    } catch (e) {
        console.error(e);
        return res.status(400).json({
            success: false,
            msg: e.message
        });
    }
}