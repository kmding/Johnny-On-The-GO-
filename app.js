var express = require('express'),
	app = express(),
	server =  require('http').createServer(app),
	Firebase = require("firebase");


server.listen(process.env.PORT || 4000, '0.0.0.0', function() {
    console.log('Listening to port:  ' + 4000);
});