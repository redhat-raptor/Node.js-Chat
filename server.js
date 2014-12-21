var fs = require('fs')
    , http = require('http')
    , socketio = require('socket.io')
    , _ = require('underscore');

var server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-type': 'text/html'});
    var template = fs.readFileSync(__dirname + '/index.html');
    res.end(template);
}).listen(8080, function() {
    console.log('Tracking users at: http://localhost:8080');
});

var userData = {
    users: {},
    getUser: function(id) {
        return this.users[id];
    },
    addNewUser: function() {
        var id = _.uniqueId('user_');
        this.users[id] = {
            id: id,
            created: new Date().getTime()
        };

        return this.users[id];
    }
};

socketio.listen(server).on('connection', function (socket) {
    socket.on('message', function (msg) {
        if(msg.type == 'identify') {
            var data = msg.data;

            if(!data || !data.id) {
                data = userData.addNewUser();
            }

            console.log(['udata', data]);
            socket.emit('identify', data);
        }

        console.log('Message Received: ', msg);
        //console.log(socket.request.headers.cookie);

        socket.broadcast.emit('message', msg);
    });
});
