const express = require('express');
const app = express();

//CONTROLLERS

const AmassController = require('../Controllers/AmassController');

//GET PROGRAMS
app.get('/:url', AmassController.GetAmass);

//EXECUTE AMASS WITH ASN FEATURE
app.post('/:url/asn', AmassController.ExecuteAmassWithASNs);
app.post('/:url/cidr', AmassController.ExecuteAmassWithCIDRs);


module.exports = app;