const express = require('express');
const app = express();

//CONTROLLERS

const DiscoveryController = require('../Controllers/DiscoveryController');

//EXECUTE WAYVACKURLS
app.post('/:url/waybackurls/all', DiscoveryController.ExecuteAllWaybackurls);
app.post('/:url/waybackurls', DiscoveryController.ExecuteWaybackurlsBySubdomain);

//EXECUTE GOSPIDER
app.post('/:url/gospider/all', DiscoveryController.ExecuteAllGoSpider);
app.post('/:url/gospider', DiscoveryController.ExecuteGoSpiderBySubdomain);

module.exports = app;