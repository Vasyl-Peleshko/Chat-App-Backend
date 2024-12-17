import { Response  } from "express";

export interface GetUserChatsResponse extends Response {
    json: (body: { message?: string; chats?: Array<{ chatId: string; user: { otherUserId: string; firstName: string; lastName: string }; lastMessage: { text: string; createdAt: Date } | null }> }) => this;
}