
const shell = require('shelljs');
const fs = require('fs');

ExecuteAmassWithASNs = (client) => {
    client.on('execute-amass-asn', (payload) => {
        const Syntax = `amass intel -asn ${payload.ASNs.toString()}`;
        // const Syntax = `findomain -t google.com`;

        shell.exec(Syntax);

        client.emit('executed-amass', {
            success: true,
            msg: 'ASN Amass executed Successfully...',
            executed: true
        });
    });
}

ExecuteAmassWithCIDRs = (client) => {
    client.on('execute-amass-cidr', (payload) => {
        const Syntax = `amass intel -cidr ${payload.CIDRs.toString()}`;
        // const Syntax = `findomain -t google.com`;

        shell.exec(Syntax);

        client.emit('executed-amass', {
            success: true,
            msg: 'CIDR Amass executed Successfully...',
            executed: true
        });
    });
}

module.exports = {
    ExecuteAmassWithASNs,
    ExecuteAmassWithCIDRs
}