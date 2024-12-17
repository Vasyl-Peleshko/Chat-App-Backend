import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies?.authToken;

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    req.user = decoded; 
    next();
  });
};
