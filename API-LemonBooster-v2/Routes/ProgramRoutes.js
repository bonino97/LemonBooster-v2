const express = require('express');
const app = express();

//CONTROLLERS

const ProgramController = require('../Controllers/ProgramController');

//GET PROGRAMS
app.get('', ProgramController.GetPrograms);

// //GET PROGRAM BY URL
app.get('/:url', ProgramController.GetProgram);

//ADD PROGRAM
app.post('', ProgramController.AddProgram);

//EDIT PROGRAM
app.put('/:url', ProgramController.EditProgram);

//REMOVE PROGRAM
app.delete('/:id', ProgramController.RemoveProgram);



module.exports = app;
