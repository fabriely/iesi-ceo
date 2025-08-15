import { Server } from 'socket.io';
import http from 'http';

let io: Server;

export function initSocket(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: '*', // Permite conexões de qualquer origem
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('🔌 Novo cliente conectado:', socket.id);
  });

  console.log('✅ Servidor Socket.IO inicializado');
  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.IO não foi inicializado!');
  }
  return io;
}