const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { v4: uuidv4 } = require('uuid');
const url_localhost = 'http://localhost:3000';
//const url_local_network = 'http://Your IP:PORT';
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const port = 3000;

const namespace1 = io.of('/namespace1');
const namespace2 = io.of('/namespace2');
const namespace3 = io.of('/namespace3');

app.use(express.static('public'));

app.get('/getId', (req, res) => {
    let newUUID = uuidv4();
    return res.json({
        'ID': '123' //newUUID
    });
});

app.get('/joinRoom', (req, res) => {
    let roomId = req.query['roomId'];

    if(io.sockets.adapter.rooms.has(roomId) === true) {
        console.log('Room with ID : ' + roomId + ' Exists !');
        return res.status(200).send('Everything Cool !');
    }
    else {
        console.log('Room with ID : ' + roomId + ' do not Exist !');
        return res.status(400).send('No Room with such an ID');
    }
});

namespace1.on('connect', socketHandler);
namespace2.on('connect', socketHandler);
namespace3.on('connect', socketHandler);

function socketHandler(socket) {
    socket.send('Welcome Client !');

    socket.on('send-message', (data) => {
        socket.to(data['Room-ID']).emit('new-message', data['Message']);
    });

    socket.on('join-room', (data) => {
        socket.join(data['Room-ID']);
    });

    socket.on('create-room', (data) => {
        socket.join(data['Room-ID']);
    });

    socket.on('disconnect', () => {
        socket.send('GoodBye Client !');
    });
}

http.listen(port, () => {
    console.log('Listening on PORT : ' + port);
});
