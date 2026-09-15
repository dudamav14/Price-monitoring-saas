import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { ScraperService } from '../services/scraper.service';

export class ProductController {
  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { competitorId, categoryId, search, limit, offset } = req.query;

      const products = await ProductService.listProducts({
        competitorId: competitorId as string,
        categoryId: categoryId as string,
        search: search as string,
        limit: limit ? parseInt(limit as string, 10) : 50,
        offset: offset ? parseInt(offset as string, 10) : 0
      });

      return res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const details = await ProductService.getProductDetails(id);

      if (!details) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado.'
        });
      }

      return res.status(200).json({
        success: true,
        data: details
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPriceHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const history = await ProductService.getProductPriceHistory(id);

      return res.status(200).json({
        success: true,
        count: history.length,
        data: history
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSentiment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const sentiment = await ProductService.getProductSentiment(id);

      return res.status(200).json({
        success: true,
        data: sentiment
      });
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await ProductService.createProduct(req.body);
      return res.status(201).json({
        success: true,
        message: 'Produto cadastrado com sucesso!',
        data: created
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message || 'Erro ao cadastrar o produto.'
      });
    }
  }

  static async extractFromUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ success: false, error: 'A URL do produto é obrigatória.' });
      }
      
      const data = await ScraperService.extractProductData(url);
      
      return res.status(200).json({
        success: true,
        data
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message || 'Erro ao extrair dados da URL.'
      });
    }
  }
}
