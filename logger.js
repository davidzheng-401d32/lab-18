'use strict';

const io = require('socket.io')(3001);
// const client = io.connect('http://localhost:3001');

io.on('connection', (socket) => {
  console.log('Connected', socket.id);

  socket.on('write_success', () => {
    console.log('file is read');
  });
});