
Disconnect = (client) => {
    client.on('disconnect', () => {
        console.log('Disconnected Client.');
    });
    return Disconnect;
}

module.exports = {
    Disconnect
}
