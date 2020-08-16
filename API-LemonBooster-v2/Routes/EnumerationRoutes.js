const express = require('express');
const app = express();

//CONTROLLERS

const EnumerationController = require('../Controllers/EnumerationController');

//GET PROGRAMS
app.get('/:url', EnumerationController.GetEnumerationProgram);

//EXECUTE ENUMERATION
app.post('/:url', EnumerationController.ExecuteSubdomainEnumeration);

//EXECUTE ALIVE
app.post('/:url/alive', EnumerationController.ExecuteAlive);


module.exports = app;