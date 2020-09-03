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

//EXECUTE GOSPIDER
app.post('/:url/hakrawler/all', DiscoveryController.ExecuteAllHakrawler);
app.post('/:url/hakrawler', DiscoveryController.ExecuteHakrawlerBySubdomain);

//EXECUTE DIRSEARCH
app.get('/:url/dirsearch/lists', DiscoveryController.GetDirsearchLists);
app.post('/:url/dirsearch/all', DiscoveryController.ExecuteAllDirsearch);
app.post('/:url/dirsearch', DiscoveryController.ExecuteDirsearchBySubdomain);

module.exports = app;