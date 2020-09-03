const Sockets = require('../Sockets/Index');
const AmassSockets = require('../Sockets/AmassSocket');
const EnumerationSockets = require('../Sockets/EnumerationSocket');
const DiscoverySockets = require('../Sockets/DiscoverySocket');


Connection = (io) => {

    console.log('Sockets: lemon-booster ~ Online');

    io.on('connection', (client) => {   
        console.log('Connected Client.');
        
        Sockets.Disconnect(client);
        // AMASS
        AmassSockets.ExecuteAmassWithASNs(client);
        AmassSockets.ExecuteAmassWithCIDRs(client);

        // ENUMERATION
        EnumerationSockets.ExecuteSubdomainEnumeration(client);
        EnumerationSockets.ExecuteAlive(client);
        EnumerationSockets.ExecuteSubdomainResponseCodes(client);
        EnumerationSockets.ExecuteScreenshot(client);
        EnumerationSockets.ExecuteJSScanner(client);
        EnumerationSockets.ExecutePermutationEnumeration(client);
        EnumerationSockets.ExecuteGithubEnumeration(client);

        // DISCOVERY 
        DiscoverySockets.ExecuteWaybackurlsAll(client);
        DiscoverySockets.ExecuteWaybackurlsBySubdomain(client);
        DiscoverySockets.ExecuteGoSpiderAll(client);
        DiscoverySockets.ExecuteGoSpiderBySubdomain(client);
        DiscoverySockets.ExecuteHakrawlerAll(client);
        DiscoverySockets.ExecuteHakrawlerBySubdomain(client);
        DiscoverySockets.ExecuteDirsearchAll(client);
        DiscoverySockets.ExecuteDirsearchBySubdomain(client);
    });

    return Connection;
}

module.exports = {
    Connection
}