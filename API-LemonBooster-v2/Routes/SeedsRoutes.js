const express = require('express');
const app = express();

//CONTROLLERS

const SeedsController = require('../Controllers/SeedsController');

//GET PROGRAMS
app.get('/:url', SeedsController.GetSeeds);

//EXECUTE AMASS WITH ASN FEATURE
app.post('/:url/asn', SeedsController.ExecuteAmassWithASNs);
app.post('/:url/cidr', SeedsController.ExecuteAmassWithCIDRs);


module.exports = app;