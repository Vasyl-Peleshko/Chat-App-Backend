import { Server, Socket } from 'socket.io';
import Message from '../models/Message';
import Chat from '../models/Chat';
import User from '../models/User';
import { fetchRandomQuote } from '../utils/randomResponse';
import { handleConnection, handleDisconnection, handleSendMessage } from '../utils/socketUtils';

export const setupSocketServer = (server: any): void => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
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

// const handleConnection = (socket: Socket, io: Server, connectedUsers: Record<string, string>) => {
//   const userId = socket.handshake.query.userId as string;

//   if (userId) {
//     connectedUsers[userId] = socket.id;
//     io.emit('updateUserList', connectedUsers);
//   }
// };

// const handleDisconnection = (socket: Socket, io: Server, connectedUsers: Record<string, string>) => {
//   const disconnectedUserId = Object.keys(connectedUsers).find(
//     (id) => connectedUsers[id] === socket.id
//   );

//   if (disconnectedUserId) {
//     delete connectedUsers[disconnectedUserId];
//     io.emit('updateUserList', connectedUsers);
//   }
// };

// const handleSendMessage = async (
//   socket: Socket,
//   io: Server,
//   connectedUsers: Record<string, string>,
//   { senderId, chatId, text }: { senderId: string; chatId: string; text: string }
// ) => {
//   try {
//     console.log(connectedUsers);
//     const newMessage = await createMessage(senderId, chatId, text);
//     await appendMessageToChat(chatId, newMessage._id as string);
//     console.log(newMessage);
    
//     const chat = await Chat.findById(chatId).populate('participants').exec();
//     if (!chat) return;

//     const { sender, receiver } = await findChatParticipants(senderId, chat);
//     if (!sender || !receiver) return;

//     sendMessageToUsers(io, connectedUsers, receiver, sender, newMessage);

//     sendAutoResponse(io, connectedUsers, senderId, receiver, chatId);
//   } catch (error) {
//     console.error('Error handling message:', error);
//   }
// };

// const createMessage = async (senderId: string, chatId: string, text: string) => {
//   const newMessage = new Message({ senderId, chatId, text });
//   return await newMessage.save();
// };

// const appendMessageToChat = async (chatId: string, messageId: string) => {
//   await Chat.findByIdAndUpdate(chatId, { $push: { messages: messageId } }, { new: true });
// };

// const findChatParticipants = async (senderId: string, chat: any) => {
//   const sender = await User.findById(senderId);
//   const receiver = chat.participants.find(
//     (participant: any) => participant._id.toString() !== senderId.toString()
//   );
//   return { sender, receiver };
// };

// const sendMessageToUsers = (
//   io: Server,
//   connectedUsers: Record<string, string>,
//   receiver: any,
//   sender: any,
//   newMessage: any
// ) => {
//   const receiverSocketId = connectedUsers[receiver._id.toString()];
//   const senderSocketId = connectedUsers[sender._id.toString()];
  
//   io.to(receiverSocketId).emit('receiveMessage', {
//     ...newMessage.toObject(),
//     senderName: `${sender.firstName} ${sender.lastName}`,
//   });

//   io.to(senderSocketId).emit('receiveMessage', {
//     ...newMessage.toObject(),
//     senderName: `${sender.firstName} ${sender.lastName}`,
//   });
// };

// const sendAutoResponse = async (
//   io: Server,
//   connectedUsers: Record<string, string>,
//   senderId: string,
//   receiver: any,
//   chatId: string
// ) => {
//   setTimeout(async () => {
//     const autoResponseText = await fetchRandomQuote();

//     const autoResponseMessage = new Message({
//       senderId: receiver._id,
//       chatId,
//       text: autoResponseText,
//     });

//     await autoResponseMessage.save();

//     const autoResponder = await User.findById(receiver._id);

//     if (autoResponder) {
//       const receiverSocketId = connectedUsers[receiver._id.toString()];
//       const senderSocketId = connectedUsers[senderId.toString()];

//       io.to(receiverSocketId).emit('receiveMessage', {
//         ...autoResponseMessage.toObject(),
//         senderName: `${autoResponder.firstName} ${autoResponder.lastName}`,
//       });

//       io.to(senderSocketId).emit('receiveMessage', {
//         ...autoResponseMessage.toObject(),
//         senderName: `${autoResponder.firstName} ${autoResponder.lastName}`,
//       });
//     }
//   }, 3000);
// };
