import { IMessage } from "../../models/Message";

export interface CreateMessageResponse {
    message: IMessage;
  }
  
export interface GetMessagesResponse {
    messages: IMessage[];
  }