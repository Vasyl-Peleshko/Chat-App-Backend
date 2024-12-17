import { Response } from "express";
import { IChat } from "../../models/Chat";

export interface CreateChatResponse extends Response {
    json: (body: { message?: string; chat?: IChat }) => this;
  }
  