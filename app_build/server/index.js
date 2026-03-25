const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const activeChats = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', ({ role, userId }) => {
    socket.join(userId);
    if (role === 'customer') {
      activeChats.set(userId, { userId, lastMessage: null });
      io.to('agents').emit('new_chat', { userId });
    } else if (role === 'agent') {
      socket.join('agents');
      socket.emit('active_chats', Array.from(activeChats.values()));
    }
  });

  socket.on('message', ({ to, from, text, role }) => {
    const message = { from, text, timestamp: new Date() };
    io.to(to).emit('message', message);
    
    if (role === 'customer') {
      const chat = activeChats.get(from);
      if (chat) {
        chat.lastMessage = text;
        activeChats.set(from, chat);
      }
    }
  });

  socket.on('typing', ({ to, from, isTyping }) => {
    io.to(to).emit('typing', { from, isTyping });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
