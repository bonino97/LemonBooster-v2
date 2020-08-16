
const mongoose = require('mongoose');
require('dotenv').config({path: '.env'});

mongoose.connect(process.env.DB, { 
    useNewUrlParser: true,  
    useFindAndModify: false,    
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000 
}, (err, res) => { 
    if(err){
        throw err;
    }
    console.log('Database: lemon-booster ~ Online');
});

mongoose.connection.on('error', (error) => {
    console.log('Ocurrio un error con tu Base de Datos: ', error); //Seria ideal Guardar Logs en alguna folder.
}); 
