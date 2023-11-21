const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path'); 
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let listOfUsers = []; 


app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/draw', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'draw.html'));
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

io.on('connection', (socket) => {
  //console.log('User connected');
  io.emit('user', listOfUsers);

  socket.on('newDrawing', (pos, color, width) => {
    io.emit('draw', pos, color, width); 
  });

  socket.on('messageSent', (message, username) => {
    io.emit('messageReceived', message, username); 
  });

  socket.on('disconnect', (reason) => {
    console.log('User disconnected:', reason);
  });
});