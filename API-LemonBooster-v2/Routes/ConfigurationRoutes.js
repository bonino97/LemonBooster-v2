const express = require('express');
const app = express();

//CONTROLLERS

const ConfigurationController = require('../Controllers/ConfigurationController');

//ADD CONFIGURATION
app.post('', ConfigurationController.AddEditConfiguration);

//GET CONFIGURATION
app.get('', ConfigurationController.GetConfiguration);

module.exports = app;