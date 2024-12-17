import { Response } from "express";

export interface DeleteChatResponse extends Response {
    json: (body: { message: string }) => this;
  }
  