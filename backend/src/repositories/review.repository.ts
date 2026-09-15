import { query } from '../config/database';

export class ReviewRepository {
  /**
   * Busca as avaliações com classificação NLP de um produto.
   */
  static async findByProductId(productId: string, limit: number = 20) {
    const sql = `
      SELECT 
        id,
        author,
        rating,
        title,
        review_text,
        sentiment_label,
        sentiment_score,
        extracted_at
      FROM product_reviews
      WHERE product_id = $1
      ORDER BY extracted_at DESC
      LIMIT $2;
    `;
    const result = await query(sql, [productId, limit]);
    return result.rows;
  }

  /**
   * Agrega estatísticas de sentimentos (contagem de positivos, neutros, negativos e média de confiança).
   */
  static async getSentimentStats(productId?: string) {
    let whereClause = '';
    const params: any[] = [];

    if (productId) {
      whereClause = 'WHERE product_id = $1';
      params.push(productId);
    }

    const sql = `
      SELECT 
        COUNT(*) AS total_reviews,
        COUNT(CASE WHEN sentiment_label = 'positive' THEN 1 END) AS positive_count,
        COUNT(CASE WHEN sentiment_label = 'neutral' THEN 1 END) AS neutral_count,
        COUNT(CASE WHEN sentiment_label = 'negative' THEN 1 END) AS negative_count,
        COALESCE(ROUND(AVG(sentiment_score)::numeric, 4), 0) AS average_confidence
      FROM product_reviews
      ${whereClause};
    `;
    const result = await query(sql, params);
    const row = result.rows[0];

    const total = parseInt(row.total_reviews, 10) || 0;
    const positive = parseInt(row.positive_count, 10) || 0;
    const neutral = parseInt(row.neutral_count, 10) || 0;
    const negative = parseInt(row.negative_count, 10) || 0;

    return {
      total_reviews: total,
      positive_count: positive,
      neutral_count: neutral,
      negative_count: negative,
      positive_percentage: total > 0 ? Math.round((positive / total) * 100) : 0,
      neutral_percentage: total > 0 ? Math.round((neutral / total) * 100) : 0,
      negative_percentage: total > 0 ? Math.round((negative / total) * 100) : 0,
      average_confidence: parseFloat(row.average_confidence)
    };
  }
}
