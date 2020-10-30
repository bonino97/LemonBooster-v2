const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.pluralize(null);

const UserSchema = new mongoose.Schema({ 
    Email:{
        type: String,
        required: 'Email required.',
        trim: true, 
        unique: true,
        lowercase: true
    },
    GitToken: String,
    TelegramToken: String,
    TelegramChatId: String,
    VirusTotalApiKey: String,
    FacebookApiKey: String,
    SecurityTrailsApiKey: String,
    CreatedAt: Date,

});

module.exports = mongoose.model('User', UserSchema);
