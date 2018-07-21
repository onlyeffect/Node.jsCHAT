var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var connections = [];
var users = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    socket.on('disconnect', function(){
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    socket.on('new user', function(user, callback){
        callback(true);
        socket.username = user;
        users.push(socket.username);
        updateUsernames();
    });

    socket.on('send message', function(msg){
        console.log('Msg: ' + msg);
        io.emit('new message', {msg: msg, username: socket.username});
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

function updateUsernames(){
    io.emit('get users', users);
}