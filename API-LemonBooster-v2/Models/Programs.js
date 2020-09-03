const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
mongoose.pluralize(null);
const slug = require('slug');
const shortId = require('shortid');

const ProgramsSchema = new Schema({
    Name:{
        type: String,
        required: 'Programs name required.',
        trim: true
    },
    Scopes: {
        type: [String],
        required: 'Almost one domain required.',
        trim: true
    },
    Acquisitions: [String],
    ASNs: [String],
    CIDRs: [String],
    Subdomains: [String],
    Alives: [String],
    Screenshots: [String],
    ResponseCodes: [{
        StatusCode: String,
        Subdomain: String
    }],
    Waybackurls: [String],
    GoSpider: [String],
    Hakrawler: [String],
    Files: [String],
    Url: {
        type: String,
        lowercase: true
    },
    Directory: String,
    PathDirectory: String,
    Users: {
        type: Schema.ObjectId,
        ref: 'Users'
    }
});

ProgramsSchema.pre('save', function(next){ //Funciona como Hook pre Guardado. (Leer documentacion, por que existen muchos.)
    //Crear la URL
    if(this.Url == null) {
        const Url = slug(this.Name);
        this.Url = `${Url}-${shortId.generate()}`;
        next();
    } else {
        next();
    }
}); 


module.exports = mongoose.model('Programs', ProgramsSchema);