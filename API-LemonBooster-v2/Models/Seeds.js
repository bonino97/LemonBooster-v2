const mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
mongoose.pluralize(null);

const SeedsSchema = new mongoose.Schema({ 
    Program: { 
        type: Schema.ObjectId, 
        ref: 'Program' 
    },
    Directory: { 
        type: String, 
        required: [true, 'Seeds Directory Required']
    },
    Syntax: String,
    ASNs: [String],
    CIDRs: [String],
    ExecutedAt: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('Seeds', SeedsSchema);