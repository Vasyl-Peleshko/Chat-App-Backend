import { Request, Response } from 'express';
import Message, { IMessage } from '../models/Message';
import Chat from '../models/Chat';
import { CreateMessageRequest, getMessagesRequest, GetMessagesResponse, CreateMessageResponse  } from '../dto/message/index';
import { ErrorResponse } from '../dto/ErrorResponse';


export const getMessagesOfChat = async (req: Request<getMessagesRequest, unknown, unknown>, res: Response<GetMessagesResponse | ErrorResponse>): Promise<void> => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      res.status(400).json({ message: 'Chat ID is required.' });
      return;
    }

    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving messages.' });
  }
};
