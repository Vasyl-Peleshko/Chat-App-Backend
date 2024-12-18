import express from 'express';
import { createChat, deleteChat, getUserChats } from '../controllers/chatController';
import { getMessagesOfChat } from '../controllers/messageController';

const router = express.Router();

router.get('/chats/:userId', getUserChats);
router.get('/messages/:chatId', getMessagesOfChat);

router.post('/createChat', createChat);

router.delete('/deleteChat/:chatId', deleteChat);

export default router;