var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('Server running...');

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');

});
	// this will show that someone conencted on my console
io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);

	// shows that I disconnected
	socket.on('diconnect', function(data){
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s socket connected', connections.length);
	});

	// shows a new message I sent
	socket.on('send message', function(data){
		io.sockets.emit('new message', {msg: data, user: socket.username});
		});


	// shows a new user 
	socket.on('new user', function(data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
		});

	function updateUsernames(){
		io.sockets.emit('get users', users);
		}

		
	});
