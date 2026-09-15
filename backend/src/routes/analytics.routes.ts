import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';

const router = Router();

router.get('/dashboard', AnalyticsController.getDashboard);

export default router;
