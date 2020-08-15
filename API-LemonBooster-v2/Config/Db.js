
const mongoose = require('mongoose');
require('dotenv').config({path: '.env'});

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, res) => { 
    
    if(err){
        throw err;
    }

    console.log('Database: lemon-booster ~ Online');
});

mongoose.connection.on('error', (error) => {
    console.log('Ocurrio un error con tu Base de Datos: ', error); //Seria ideal Guardar Logs en alguna folder.
}); 
