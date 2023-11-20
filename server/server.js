const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Socket.io setup
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle drawing events here
  socket.on('newDrawing', (start, end, color) => {
    io.emit('draw', start, end, color); 
  })

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
