const express = require('express');
const app = express();

//CONTROLLERS

const EnumerationController = require('../Controllers/EnumerationController');

//GET PROGRAMS
app.get('/:url', EnumerationController.GetEnumerationProgram);

//EXECUTE ENUMERATION
app.post('/:url', EnumerationController.ExecuteSubdomainEnumeration);

// //GET SUBDOMAINS BY SCOPE
app.get('/:url/subdomains', EnumerationController.GetSubdomainsByScope);

//EXECUTE ALIVE
app.post('/:url/alive', EnumerationController.ExecuteAlive);

// //GET ALIVES BY SCOPE
app.get('/:url/alives', EnumerationController.GetAlivesByScope);

//EXECUTE SCREENSHOTS
app.post('/:url/screenshot', EnumerationController.ExecuteScreenshots);

//GET SCREENSHOT FILE
app.get('/:url/screenshot', EnumerationController.GetScreenshotsByScope);

//EXECUTE JS SCANNER
app.post('/:url/js', EnumerationController.ExecuteJSScanner);

//GET JS FILES
app.get('/:url/js', EnumerationController.GetJSFileBySubdomain);

//EXECUTE RESPONSE CODES SCANNER
app.post('/:url/response-codes', EnumerationController.ExecuteSubdomainResponseCodes);

//GET RESPONSE CODES SUBDOMAINS
app.get('/:url/response-codes', EnumerationController.GetResponseCodesSubdomainsByScope);

module.exports = app;