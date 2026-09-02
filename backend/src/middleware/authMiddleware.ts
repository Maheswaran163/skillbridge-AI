import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { firebaseApp, inMemoryStore } from '../firebase/admin';
import { UserRole } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    name: string;
    role: UserRole;
    institutionId: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or malformed Authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];

  // 1. Try Firebase Admin token verification if live app initialized
  if (firebaseApp) {
    try {
      const decodedToken = await firebaseApp.auth().verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        name: decodedToken.name || 'User',
        role: (decodedToken.role as UserRole) || 'student',
        institutionId: (decodedToken.institutionId as string) || 'inst_iitb',
      };
      next();
      return;
    } catch (err) {
      // Fallback to JWT or local store if custom token passed
    }
  }

  // 2. JWT or Local Store Demo User Authentication
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    req.user = decoded;
    next();
    return;
  } catch (err) {
    // 3. Fallback for easy demo testing with mock UIDs in Bearer header (e.g., Bearer std_aarav)
    const demoUser = inMemoryStore.getUserByUid(token);
    if (demoUser) {
      req.user = {
        uid: demoUser.uid,
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role,
        institutionId: demoUser.institutionId,
      };
      next();
      return;
    }
  }

  res.status(401).json({ error: 'Unauthorized: Invalid authentication token' });
};

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized: User authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: `Forbidden: Access restricted to roles [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`,
      });
      return;
    }

    next();
  };
};
