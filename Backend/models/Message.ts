import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  chatId: mongoose.Types.ObjectId;
  text: string;
  timestamp: Date;
  createdAt?: Date; // Додано для timestamps
  updatedAt?: Date; // Додано для timestamps
}

const messageSchema: Schema<IMessage> = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: true }
);

const Message: Model<IMessage> = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
