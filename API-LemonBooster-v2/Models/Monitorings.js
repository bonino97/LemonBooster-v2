const mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
mongoose.pluralize(null);

const MonitoringsSchema = new mongoose.Schema({
    Program: {
        type: Schema.ObjectId,
        ref: 'Programs',
        required: [true, 'Program Required']
    },
    Scope: { 
        type: String, 
        required: [true, 'Scope Required']
    },
    Type: {
        type: Number, 
        required: [true, 'Monitoring Type Required.']
    },
    Date: {
        type: Date,
        default: Date.now()
    },
    Results: [String]
});


module.exports = mongoose.model('Monitorings', MonitoringsSchema);