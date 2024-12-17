import jwt from 'jsonwebtoken';
import { Response } from 'express';
import GenerateTokenParams from '../dto/GenerateTokenParams';


export const generateTokenAndSetCookie = (
  res: Response,
  { userId, secret, expiresIn = '1h' }: GenerateTokenParams
): void => {
  const token = jwt.sign({ userId }, secret, { expiresIn });
  res.cookie('authToken', token, { httpOnly: true });
};
