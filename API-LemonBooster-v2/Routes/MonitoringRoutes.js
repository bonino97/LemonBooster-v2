const express = require('express');
const app = express();

//CONTROLLERS

const MonitoringController = require('../Controllers/MonitoringController');

app.get('/:url', MonitoringController.GetMonitoringByDate);

module.exports = app;