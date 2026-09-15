import { Request, Response, NextFunction } from 'express';
import { PipelineService } from '../services/pipeline.service';

export class PipelineController {
  static async trigger(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PipelineService.triggerScraperPipeline();
      return res.status(200).json({
        success: result.success,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }
}
