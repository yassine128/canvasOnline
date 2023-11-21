const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path'); // Add this line for path module

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let listOfUsers = []; 

// Use path.join to construct the correct absolute path
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/draw', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'draw.html'));
});


const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

io.on('connection', (socket) => {
  //console.log('User connected');
  io.emit('user', listOfUsers);

  socket.on('newDrawing', (start, end, color, width) => {
    io.emit('draw', start, end, color, width); 
  });

  socket.on('newUser', (username) => {
    if (username !== "") {
      listOfUsers.push(username); 
      io.emit('user', listOfUsers); 
    }
  }); 

  socket.on('messageSent', (message, username) => {
    io.emit('messageReceived', message, username); 
  });

  socket.on('disconnect', (reason) => {
    //console.log('User disconnected:', reason);

    // Retrieve the disconnected username from the cookie
    const disconnectedUsername = socket.handshake.headers.cookie
      .split('; ')
      .find(cookie => cookie.startsWith('username='))
      .split('=')[1];

    // Remove the disconnected user from the list
    const index = listOfUsers.indexOf(disconnectedUsername);
    if (index !== -1) {
      listOfUsers.splice(index, 1);
      io.emit('user', listOfUsers); // Emit updated user list to all clients
    }
  });
});
