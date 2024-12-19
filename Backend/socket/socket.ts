import { Server, Socket } from 'socket.io';
import Message from '../models/Message';
import Chat from '../models/Chat';
import User from '../models/User';
import { fetchRandomQuote } from '../utils/randomResponse';
import { handleConnection, handleDisconnection, handleSendMessage } from '../utils/socketUtils';

export const setupSocketServer = (server: any): void => {
  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        callback(null, true);
      },
      methods: ["GET", "POST"],
      credentials: true, 
    },
  });
  
  const connectedUsers: Record<string, string> = {};

  io.on('connection', (socket) => {
    handleConnection(socket, io, connectedUsers);

    socket.on('disconnect', () => handleDisconnection(socket, io, connectedUsers));

    socket.on('sendMessage', (data) =>
      handleSendMessage(socket, io, connectedUsers, data)
    
    );
  });
};

