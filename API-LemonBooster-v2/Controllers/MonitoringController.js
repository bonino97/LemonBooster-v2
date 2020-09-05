'use strict'

//LIBRARIES 

const shell = require('shelljs');
const fs = require('fs');
const moment = require('moment');

//MODELS

const Program = require('../Models/Programs');
const Monitorings = require('../Models/Monitorings');



//CONSTANTS
require('dotenv').config({path: '.env'});

const { PaginatedMonitoringResults } = require('../Helpers/PaginatedResult');

exports.GetMonitoringByDate = async (req,res) => {
    try{

        const program = await Program.findOne({Url: req.params.url});
        const monitoring = await Monitorings.find({Program: program._id, Scope: req.query.scope, Type: req.query.type, Date: { $gte: req.query.startDate, $lte: req.query.endDate }}); //new Date(req.query.date)

        if(monitoring.length === 0){
            return res.status(404).json({
                success: false,
                msg: 'There are no new results with this date...'
            });
        }

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const filter = req.query.filter;
        var totalArray = [];

        monitoring.forEach(elem => {
            elem.Results.forEach(elem => {
                if(elem.length > 0){
                    totalArray.push(elem);
                }
            });
        });

        const monitorings = await PaginatedMonitoringResults(totalArray, page, limit, filter);

        if(monitorings.results.length === 0){
            return res.status(404).json({
                success: false,
                msg: 'There are no new results with this monitoring...'
            });
        }

        return res.status(200).json(monitorings);

    } catch(e) {
        console.error(e);
        return res.status(400).json({
            success: false,
            msg: e.message
        });
    }

}