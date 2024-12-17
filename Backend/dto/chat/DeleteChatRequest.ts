import { Request } from "express";

export interface DeleteChatRequest extends Request {
    params: {
      chatId: string;
    };
  }
  