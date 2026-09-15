import { ProductRepository, ProductFilter } from '../repositories/product.repository';
import { ReviewRepository } from '../repositories/review.repository';

export class ProductService {
  static async listProducts(filters: ProductFilter) {
    return await ProductRepository.findAll(filters);
  }

  static async getProductDetails(id: string) {
    const product = await ProductRepository.findById(id);
    if (!product) {
      return null;
    }

    const priceHistory = await ProductRepository.findPriceHistory(id, 30);
    const sentimentStats = await ReviewRepository.getSentimentStats(id);
    const recentReviews = await ReviewRepository.findByProductId(id, 10);

    return {
      product,
      priceHistory,
      sentimentStats,
      recentReviews
    };
  }

  static async getProductPriceHistory(id: string) {
    return await ProductRepository.findPriceHistory(id, 50);
  }

  static async getProductSentiment(id: string) {
    return await ReviewRepository.getSentimentStats(id);
  }

  static async createProduct(data: any) {
    if (!data.title || !data.brand || !data.product_url || !data.current_price) {
      throw new Error('Campos obrigatórios ausentes: Título, Marca, URL do Produto e Preço Atual são necessários.');
    }
    if (typeof data.current_price !== 'number' || data.current_price <= 0) {
      throw new Error('O preço atual deve ser um número positivo.');
    }
    return await ProductRepository.createManualProduct(data);
  }
}
