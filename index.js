
console.log("Hello");
var express = require('express'),
    http    = require('http'),
    config  = require('./config'),
    app     = new express(),
    server  = http.createServer(app),
    port    = process.env.OPENSHIFT_NODEJS_PORT || 8080;
app.use('/api', require('./routes/api.js'));
app.get('/',function (req, res) {
    req.status(200).send("landed");
})
app.set('port',port);
process.env.port = port;
var server = http.createServer(app);
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'
console.log('port:',port);
console.log('server_ip_address:',server_ip_address);
server.listen(port, server_ip_address, function () {
    console.log( "Listening on " + server_ip_address + ", port " + port )
});
server.on('error', onError);
server.on('listening', onListening);

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
process.once('SIGINT', function() {
    log('App terminated - closing in 3 seconds to allow graceful DB disconnects');
    setTimeout(function(){
        process.exit(0);
    }, 3000);
});

process.on('uncaughtException', function (err) {
    console.error('UncaughtException:', err.message, err.stack);
    process.exit(1);
});