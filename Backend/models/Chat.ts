import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
}

const chatSchema: Schema<IChat> = new mongoose.Schema(
  {
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      required: true,
    },
    messages: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Message',
    },
  },
  { timestamps: true }
);

const Chat: Model<IChat> = mongoose.model<IChat>('Chat', chatSchema);

export default Chat;
