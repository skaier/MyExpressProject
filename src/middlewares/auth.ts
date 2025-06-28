import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError';
import config from '../config/env';

interface JwtPayload {
  userId: number;
  iat: number;
  exp: number;
}

const auth = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    // 1) Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }

    // 2) Verify token
    const decoded = jwt.verify(token, config.app.jwtSecret) as JwtPayload;
    
    // 3) Add user to request
    req.user = { id: decoded.userId };
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(401, 'Invalid token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new ApiError(401, 'Token expired'));
    } else {
      next(error);
    }
  }
};

export default auth;