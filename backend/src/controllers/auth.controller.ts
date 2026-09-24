import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username and password are required',
        });
      }

      const result = await AuthService.login(username, password);
      return res.status(200).json({
        success: true,
        message: 'Admin authenticated successfully',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthenticated' });
      }
      const admin = await AuthService.getMe(req.user.id);
      return res.status(200).json({
        success: true,
        message: 'Authenticated admin profile retrieved successfully',
        data: admin,
      });
    } catch (err) {
      next(err);
    }
  }

  static async logout(_req: Request, res: Response) {
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }
}
