import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const router = Router();

router.get('/', ProductController.getProducts);
router.post('/extract', ProductController.extractFromUrl);
router.post('/', ProductController.createProduct);
router.get('/:id', ProductController.getProductById);
router.get('/:id/history', ProductController.getPriceHistory);
router.get('/:id/sentiment', ProductController.getSentiment);

export default router;
