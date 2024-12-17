import { Request } from "express";

export interface CreateChatRequest extends Request {
    body: {
      participants: string[];
    };
  }
  