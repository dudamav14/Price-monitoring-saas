import { Router } from 'express';
import productRoutes from './product.routes';
import analyticsRoutes from './analytics.routes';
import pipelineRoutes from './pipeline.routes';

const router = Router();

// Rota de Health Check da API
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Market Intelligence Backend API'
  });
});

// Registro dos submódulos de rotas
router.use('/products', productRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/pipeline', pipelineRoutes);

export default router;
