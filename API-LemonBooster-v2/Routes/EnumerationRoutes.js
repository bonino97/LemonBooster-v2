const express = require('express');
const app = express();

//CONTROLLERS

const EnumerationController = require('../Controllers/EnumerationController');

//GET PROGRAMS
app.get('/:url', EnumerationController.GetEnumeration);

//EXECUTE ENUMERATION
app.post('/:url', EnumerationController.ExecuteSubdomainEnumeration);


module.exports = app;