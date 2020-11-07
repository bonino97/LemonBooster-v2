'use strict';

//LIBRARIES

const shell = require('shelljs');
require('dotenv').config({ path: '.env' });

//MODELS

const Configuration = require('../Models/Configurations');

exports.AddEditConfiguration = async (req, res) => {
  try {
    const body = req.body;
    const userId = body.UserId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        msg: `User doesn't exist.`,
      });
    }

    const configuration = await Configuration.findOneAndUpdate(
      { UserId: userId },
      body
    );

    if (!configuration) {
      const configuration = new Configuration(body);

      configuration.save();
    }

    process.env.GIT_TOKEN = configuration.GitToken;

    process.env.APIKEY_VIRUSTOTAL = configuration.VirusTotalApiKey;
    process.env.APIKEY_FB_TOKEN = configuration.FacebookApiKey;
    process.env.APIKEY_SECURITYTRAILS = configuration.SecurityTrailsApiKey;

    process.env.TELEGRAM_TOKEN = configuration.TelegramToken;
    process.env.TELEGRAM_CHAT_ID = configuration.TelegramChatId;

    return res.status(200).json({
      success: true,
      data: configuration,
      msg: `Keys added successfully...`,
    });
  } catch (e) {
    console.error(e);
    return res.status(400).json({
      success: false,
      msg: 'Something Wrong',
    });
  }
};

exports.GetConfiguration = async (req, res) => {
  try {
    const userId = req.query.id;

    await Configuration.findOne({ UserId: userId }, (err, configuration) => {
      if (err) {
        return res.status(400).json({
          success: false,
          msg: 'Error getting configuration.',
          errors: err,
        });
      }

      if (!configuration) {
        return res.status(404).json({
          success: false,
          msg: `Doesn't exist configuration with this Id.`,
        });
      }

      return res.status(200).json({
        success: true,
        data: configuration,
      });

    });
  } catch (e) {
    console.error(e);
    return res.status(400).json({
      success: false,
      msg: e.message,
    });
  }
};
