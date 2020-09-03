const express = require('express');
const app = express();

//CONTROLLERS

const ResultsController = require('../Controllers/ResultsController');

//GET PROGRAMS
app.get('/:url/subdomains', ResultsController.GetSubdomainsResults);

app.get('/:url/alives', ResultsController.GetAlivesResults);

app.get('/:url/response-codes', ResultsController.GetResponseCodesResults);

app.get('/:url/wayback', ResultsController.GetWaybackResults);

app.get('/:url/wayback-subdomain', ResultsController.GetWaybackBySubdomainResults);

app.get('/:url/gospider', ResultsController.GetGoSpiderResults);

app.get('/:url/gospider-subdomain', ResultsController.GetGoSpiderBySubdomainResults);

app.get('/:url/hakrawler', ResultsController.GetHakrawlerResults);

app.get('/:url/hakrawler-subdomain', ResultsController.GetHakrawlerBySubdomainResults);

app.get('/:url/dirsearch', ResultsController.GetDirsearchResults);

app.get('/:url/dirsearch-subdomain', ResultsController.GetDirsearchBySubdomainResults);


module.exports = app;