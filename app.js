var express = require('express');
var app = express.createServer();
var socket = require('socket.io');
app.configure(function(){
  app.use(express.static(__dirname + '/'));
});
var server = app.listen(8080);
var io = socket.listen(server);

io.sockets.on('connection', function (socket) {
	console.log("connnect");
	socket.on('disconnect', function (socket) {
		console.log("disconnect");
	});
	socket.emit("pong",{txt:"Connected to server"});
	socket.on('ping', function (data) {
		console.log(data);
		// react to submitted data and send request to arduino
		socket.emit("pong",{txt: data.pin + " was clicked with a value of " + data.value + " and a mode of " + data.mode});
		socket.broadcast.emit("pong",{txt:"Pong (from server)"});
	});
});

