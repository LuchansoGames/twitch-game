var http = require('http');
var express = require('express');
var app = express();
var request = require('request');

var httpServer = http.createServer(app);

httpServer.listen(80);

app.get('/getUserData', function (req, res) {
  request('https://tmi.twitch.tv/group/user/luchanso/chatters', function(err, status, body) {
    res.send(body);
  })
});

app.use(express.static('public'));