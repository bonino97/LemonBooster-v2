const express = require('express');
const app = express();

//CONTROLLERS

const DiscoveryController = require('../Controllers/DiscoveryController');

//EXECUTE ENUMERATION
app.post('/:url/waybackurls/all', DiscoveryController.ExecuteAllWaybackurls);
app.post('/:url/waybackurls', DiscoveryController.ExecuteWaybackurlsBySubdomain);

module.exports = app;