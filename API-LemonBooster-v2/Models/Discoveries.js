const mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
mongoose.pluralize(null);

const DiscoveriesSchema = new mongoose.Schema({ 
    Directory: { 
        type: String, 
        required: [true, 'Discovery Directory Required']
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
    Single: Boolean,
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


module.exports = mongoose.model('Discoveries', DiscoveriesSchema);