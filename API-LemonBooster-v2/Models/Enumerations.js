const mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
mongoose.pluralize(null);

const EnumerationsSchema = new mongoose.Schema({ 
    Directory: { 
        type: String, 
        required: [true, 'Enumeration Directory Required']
    },
    Scope: { 
        type: String, 
        required: [true, 'Scope Required']
    },
    Type: { 
        type: Number, 
        required: [true, 'Type Required']
    },
    File: String,
    NewFile: String,
    UrlFile: String,
    Subdomain: String, 
    Syntax: [String],
    ExecutedAt: {
        type: Date,
        default: Date.now()
    },
    Executed: Boolean,
    PathDirectory: String,
    Program: {
        type: Schema.ObjectId,
        ref: 'Programs'
    }
});


module.exports = mongoose.model('Enumerations', EnumerationsSchema);