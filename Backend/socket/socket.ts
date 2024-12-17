import { Server } from 'socket.io';
import Message from '../models/Message';
import Chat from '../models/Chat';
import User from '../models/User';
import { fetchRandomQuote } from '../utils/randomResponse';

export const setupSocketServer = (server: any): void => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  const connectedUsers: Record<string, string> = {};

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId as string;
    console.log('connect', userId);
    
    if (userId) {
      connectedUsers[userId] = socket.id;
      io.emit('updateUserList', connectedUsers);
    }

    socket.on('disconnect', () => {
      const disconnectedUserId = Object.keys(connectedUsers).find(
        (id) => connectedUsers[id] === socket.id
      );

      if (disconnectedUserId) {
        delete connectedUsers[disconnectedUserId];
        io.emit('updateUserList', connectedUsers);
      }
    });

    socket.on('sendMessage', async ({ senderId, chatId, text }: { senderId: string; chatId: string; text: string }) => {
      try {
        const newMessage = new Message({
          senderId,
          chatId,
          text,
        });

        await newMessage.save();

        await Chat.findByIdAndUpdate(
          chatId,
          { $push: { messages: newMessage._id } },
          { new: true }
        );

        const chat = await Chat.findById(chatId).populate('participants').exec();

        if (!chat) return;

        const sender = await User.findById(senderId);
        const receiver = chat.participants.find(
          (participant: any) => participant._id.toString() !== senderId.toString()
        );

        if (!sender || !receiver) return;

        const receiverSocketId = connectedUsers[receiver._id.toString()];
        io.to(receiverSocketId).emit('receiveMessage', {
          ...newMessage.toObject(),
          senderName: `${sender.firstName} ${sender.lastName}`,
        });

        const senderSocketId = connectedUsers[senderId.toString()];

        setTimeout(async () => {
          const autoResponseText = await fetchRandomQuote();

          const autoResponseMessage = new Message({
            senderId: receiver._id,
            chatId,
            text: autoResponseText,
          });

          await autoResponseMessage.save();

          const autoResponder = await User.findById(receiver._id);

          if (autoResponder) {
            io.to(receiverSocketId).emit('receiveMessage', {
              ...autoResponseMessage.toObject(),
              senderName: `${autoResponder.firstName} ${autoResponder.lastName}`,
            });

            io.to(senderSocketId).emit('receiveMessage', {
              ...autoResponseMessage.toObject(),
              senderName: `${autoResponder.firstName} ${autoResponder.lastName}`,
            });
          }
        }, 3000);
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });
  });
};
