import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';

export class AnalyticsController {
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await AnalyticsService.getDashboardSummary();
      return res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  }
}
