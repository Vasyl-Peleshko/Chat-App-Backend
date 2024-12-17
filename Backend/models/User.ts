import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const userSchema: Schema<IUser> = new Schema(
  {
    firstName: { 
      type: String, 
      required: true 
    },
    lastName: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: { 
      type: String, 
      required: true 
    },
  },
  {
    timestamps: true, 
  }
);

// Модель користувача
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
