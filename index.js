//what goes on the homepage?
//TODO host/channel as url, connects to socket.io namespace?
//TODO scaling, how far can we go with a single instance?
//pluggable persistence (filesystem, aws, redis?)
//EXTRAS: captions, comments, voting system, allow text submissions, limit text length?
var dotenv = require('dotenv');
dotenv.load();
var path = require('path');
//var async = require('async');
var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var options;
if (process.env.HTTPS) {
    options = {
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem')
    };
    var httpsServer = https.createServer(options, app).listen(process.env.HTTPS_PORT || 5001);
}
var app = express(options);
var server = http.createServer(app).listen(process.env.PORT || 5000);
/*
//var React = require("react");
//var App = React.createFactory(require("./public/app"));
app.get("/", function(req, res) {
    var markup = React.renderToString(App());
    res.send(markup);
});
*/
//TODO persist photos for some ttl, display recent/top photos for newly connected users?
//pubsub through redis or socket.io?
var io = require('socket.io')(server || httpsServer);
io.on('connection', function(socket) {
    socket.on('photo', function(data) {
        console.log('got photo');
        io.emit('stream', data);
    });
});
app.use(express.static(path.resolve(__dirname, 'public')));
