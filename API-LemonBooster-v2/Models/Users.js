const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slug');
const shortId = require('shortid');
const bcrypt = require('bcrypt');
mongoose.pluralize(null);

const UserSchema = new mongoose.Schema({ 
    Email:{
        type: String,
        required: 'Email required.',
        trim: true, 
        unique: true,
        lowercase: true
    },
    Username:{
        type: String,
        required: 'Username required.'
    },
    Password:{
        type: String, 
        required: 'Password required.',
        trim: true
    },

    CreatedAt: Date,

});

//Metodo para Hashear los Passwords
UserSchema.pre('save', async function (next) {
    //Si el password ya esta hasheado, no hacemos nada.
    if(!this.isModified('Password')) {
        return next(); //Detener la ejecucion, y continuar con el siguiente middleware
    }
    const Hash = await bcrypt.hash(this.Password, 10);
    this.Password = Hash; 

    next();
});

//Autenticar Usuarios
UserSchema.methods = {
    ComparePassword: function(Password){
        return bcrypt.compareSync(Password, this.Password);
    }
}


module.exports = mongoose.model('User', UserSchema);
