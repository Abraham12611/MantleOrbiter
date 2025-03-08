import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    address: string;
  };
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

export function attachUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.session.userId) {
    const user = storage.users.get(req.session.userId);
    if (user) {
      req.user = { id: user.id, address: user.address || '' };
    }
  }
  next();
}
