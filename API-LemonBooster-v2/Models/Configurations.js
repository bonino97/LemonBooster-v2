const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.pluralize(null);

const ConfigurationsSchema = new mongoose.Schema({ 
    UserId:{
        type: String,
        required: 'UserId required.',
        trim: true, 
        unique: true
    },
    GitToken: String,
    TelegramToken: String,
    TelegramChatId: String,
    VirusTotalApiKey: String,
    FacebookApiKey: String,
    SecurityTrailsApiKey: String
});

module.exports = mongoose.model('Configurations', ConfigurationsSchema);
