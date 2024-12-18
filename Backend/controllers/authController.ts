import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { generateTokenAndSetCookie } from '../utils/tokenUtils';
import { signInUserRequest, signupUserRequest } from '../dto/auth/index';
import Chat from '../models/Chat';

export const signupUser = async (req: Request<unknown, unknown, signupUserRequest>, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    

    const randomUsers = await User.aggregate([{ $sample: { size: 3 } }]);

    console.log(randomUsers);
    
    const chatPromises = randomUsers.map((randomUser) => {
      return new Chat({
        participants: [newUser._id, randomUser._id],
        messages: [],
      }).save();
    });

    await Promise.all(chatPromises);

    generateTokenAndSetCookie(res, {
      userId: newUser._id as string,
      secret: process.env.JWT_SECRET as string,
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const signinUser = async (req: Request<unknown, unknown, signInUserRequest>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    generateTokenAndSetCookie(res, {
      userId: user._id as string,
      secret: process.env.JWT_SECRET as string,
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in', error });
  }
};


export const getUserByName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { firstName, lastName } = req.body;
  
      const user = await User.findOne({ firstName, lastName });
  
      if (!user) {
        res.status(404).json({ message: 'User not found.' });
        return;
      }
  
      res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving user.' });
    }
  };