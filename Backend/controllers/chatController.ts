import { Request, Response } from "express";
import Chat, {IChat} from "../models/Chat";
import User, { IUser } from "../models/User";
import Message, { IMessage } from "../models/Message";
import { CreateChatRequest, GetUserChatsRequest, CreateChatResponse, GetUserChatsResponse, DeleteChatRequest, DeleteChatResponse } from "../dto/chat/index";


export const createChat = async (req: CreateChatRequest, res: CreateChatResponse): Promise<void> => {
  try {
    const { participants } = req.body;

    if (!participants || participants.length !== 2) {
      res.status(400).json({ message: 'You must specify exactly two participants for the chat.' });
      return;
    }

    const newChat = new Chat({
      participants,
      messages: []
    });

    await newChat.save();

    res.status(201).json({ chat: newChat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating chat.' });
  }
};

  export const getUserChats = async (req: GetUserChatsRequest, res: GetUserChatsResponse): Promise<void> => {
    try {
      const { userId } = req.params;
  
      const chats = await Chat.find({ participants: userId }).populate('participants');
  
      const chatDetails: Array<{ chatId: string; user: { otherUserId: string; firstName: string; lastName: string }; lastMessage: { text: string; createdAt: Date } | null }> = [];
  
      for (const chat of chats) {
        const otherParticipant = chat.participants.find((participant: any) => participant._id.toString() !== userId);
        if (!otherParticipant) continue;
  
        const otherUser: IUser | null = await User.findById(otherParticipant._id).select('firstName lastName');
        if (!otherUser) continue;
  
        const lastMessage: IMessage | null = await Message.findOne({ chatId: chat._id })
          .sort({ createdAt: -1 })
          .select('text createdAt');
  
        chatDetails.push({
          chatId: chat._id as string,
          user: {
            otherUserId: otherParticipant._id.toString(), 
            firstName: otherUser.firstName,
            lastName: otherUser.lastName,
          },
          lastMessage: lastMessage  ? {
            text: lastMessage.text,
            createdAt: lastMessage.createdAt ?? new Date,
          }
        : null,
    });
  }

  chatDetails.sort((a, b) => {
    if (!a.lastMessage) return 1;
    if (!b.lastMessage) return -1;
    return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
  });

  res.status(200).json({ chats: chatDetails });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Error retrieving user chats.' });
}
};


  export const deleteChat = async (req: DeleteChatRequest, res: DeleteChatResponse): Promise<void> => {
    try {
      const { chatId } = req.params;
  
      const chat = await Chat.findById(chatId);
  
      if (!chat) {
        res.status(404).json({ message: 'Chat not found.' });
      } else {
        await Message.deleteMany({ chatId: chat._id });
  
        await Chat.findByIdAndDelete(chatId);
  
        res.status(200).json({ message: 'Chat deleted successfully.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting chat.' });
    }
  };