
const mongoose = require('mongoose');
require('dotenv').config({path: '.env'});

mongoose.connect((process.env.DB || "mongodb://localhost:27017/lemonbooster"), { 
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
    console.log('An error ocurred with DB Connection: ', error); //Seria ideal Guardar Logs en alguna folder.
}); 
