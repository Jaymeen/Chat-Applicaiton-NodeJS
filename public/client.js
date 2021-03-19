const url = 'http://localhost:3000';
const socket = io(url);

const textJoinRoomId = document.getElementById('join-room-text');
const labelRoomId = document.getElementById('room-id');
const textMessage = document.getElementById('message-text');
const displayMessage = document.getElementById('message-display');

let textRoom = undefined;

function sendMessage() {
    let message = textMessage.value;
    textMessage.value = '';
    let internalDiv = document.createElement('div');
    internalDiv.classList.add('col-md-12');
    internalDiv.classList.add('text-right');
    let paragraph = document.createElement('p');
    paragraph.innerText = message;
    internalDiv.appendChild(paragraph);
    displayMessage.appendChild(internalDiv);

    if(textRoom === undefined) {
        console.log('cannot send messages yet !');
    }
    else {
        socket.emit('send-message', { 'Room-ID': textRoom,'Message': message });
    }
}

socket.on('new-message', (message) => {
    let internalDiv = document.createElement('div');
    internalDiv.classList.add('col-md-12');
    internalDiv.classList.add('text-left');
    let paragraph = document.createElement('p');
    paragraph.innerText = message;
    internalDiv.appendChild(paragraph);
    displayMessage.appendChild(internalDiv);
});

socket.on('message', (message) => {
    console.log('Message : ' + message);
});

async function createRoom(element) {
    element.disabled = true;

    let output = await fetch(url + '/getId', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    }).then(response => {
        return response.json();
    }).then(data => {
        textRoom = data.ID;
        labelRoomId.innerText = textRoom;
        socket.emit('create-room', { 'Room-ID': textRoom });
    }).catch(error => {
        console.log('In First Error ' + error.message);
    });
}

async function joinRoom(element) {
    //element.disabled = true;
    textRoom = textJoinRoomId.value;

    let output = await fetch(url + '/joinRoom?roomId=' + textRoom, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    }).then(response => {
        if (response.status === 200) {
            return response.text();
        }
    }).then(data => {
        console.log(data);
    }).catch(error => {
        console.log('Error Occurred : ' + error.message);
    });

    socket.emit('join-room', { 'Room-ID': textRoom });
}
