import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service.js';

export class DashboardController {
  static async getDashboardStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await DashboardService.getDashboardStats();
      return res.status(200).json({
        success: true,
        message: 'Dashboard statistics retrieved successfully',
        data: stats,
      });
    } catch (err) {
      next(err);
    }
  }
}
