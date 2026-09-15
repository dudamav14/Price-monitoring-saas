import { Router } from 'express';
import { PipelineController } from '../controllers/pipeline.controller';

const router = Router();

router.post('/trigger', PipelineController.trigger);

export default router;
