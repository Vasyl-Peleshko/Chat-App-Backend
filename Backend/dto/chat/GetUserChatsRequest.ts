import { Request } from "express";

export interface GetUserChatsRequest extends Request {
    params: {
      userId: string;
    };
  }
  