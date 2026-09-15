import { query } from '../config/database';
import { ReviewRepository } from '../repositories/review.repository';

export class AnalyticsService {
  /**
   * Consolida métricas executivas do mercado para o Dashboard principal do Front-end.
   */
  static async getDashboardSummary() {
    // 1. Total de produtos monitorados
    const productsRes = await query(`
      SELECT 
        COUNT(*) AS total_products,
        COUNT(DISTINCT competitor_id) AS total_competitors
      FROM products WHERE is_active = TRUE;
    `);

    // 2. Desconto médio e maiores ofertas ativas
    const dealsRes = await query(`
      SELECT 
        p.id,
        p.title,
        p.image_url,
        c.name AS competitor_name,
        ph.price,
        ph.original_price,
        ph.discount_percentage
      FROM products p
      INNER JOIN competitors c ON p.competitor_id = c.id
      INNER JOIN LATERAL (
        SELECT price, original_price, discount_percentage 
        FROM price_history 
        WHERE product_id = p.id 
        ORDER BY extracted_at DESC LIMIT 1
      ) ph ON TRUE
      WHERE ph.discount_percentage > 0
      ORDER BY ph.discount_percentage DESC
      LIMIT 5;
    `);

    // 3. Distribuição global de sentimentos de mercado (NLP)
    const sentimentStats = await ReviewRepository.getSentimentStats();

    // 4. Média global de desconto no mercado
    const avgDiscountRes = await query(`
      SELECT ROUND(AVG(discount_percentage)::numeric, 2) AS average_market_discount
      FROM (
        SELECT DISTINCT ON (product_id) discount_percentage
        FROM price_history
        ORDER BY product_id, extracted_at DESC
      ) latest_prices;
    `);

    return {
      kpis: {
        total_products: parseInt(productsRes.rows[0].total_products, 10) || 0,
        total_competitors: parseInt(productsRes.rows[0].total_competitors, 10) || 0,
        average_market_discount: parseFloat(avgDiscountRes.rows[0].average_market_discount) || 0.0,
        total_reviews: sentimentStats.total_reviews
      },
      sentiment_distribution: sentimentStats,
      top_deals: dealsRes.rows
    };
  }
}
