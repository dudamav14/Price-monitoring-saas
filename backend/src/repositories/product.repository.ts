import { query } from '../config/database';

export interface ProductFilter {
  competitorId?: string;
  categoryId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export class ProductRepository {
  /**
   * Busca lista de produtos monitorados com dados do concorrente, categoria e último preço.
   */
  static async findAll(filters: ProductFilter = {}) {
    const { competitorId, categoryId, search, limit = 50, offset = 0 } = filters;
    const values: any[] = [];
    let paramIndex = 1;

    let whereClause = 'WHERE p.is_active = TRUE';

    if (competitorId && competitorId.trim() !== '') {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(competitorId);
      if (isUuid) {
        whereClause += ` AND p.competitor_id = $${paramIndex++}`;
        values.push(competitorId);
      } else {
        whereClause += ` AND c.name ILIKE $${paramIndex++}`;
        values.push(`%${competitorId}%`);
      }
    }

    if (categoryId && categoryId.trim() !== '') {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryId);
      if (isUuid) {
        whereClause += ` AND p.category_id = $${paramIndex++}`;
        values.push(categoryId);
      } else {
        whereClause += ` AND cat.name ILIKE $${paramIndex++}`;
        values.push(`%${categoryId}%`);
      }
    }

    if (search) {
      whereClause += ` AND (p.title ILIKE $${paramIndex} OR p.brand ILIKE $${paramIndex})`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    const sql = `
      SELECT 
        p.id,
        p.sku,
        p.title,
        p.description,
        p.product_url,
        p.image_url,
        p.brand,
        p.target_price,
        p.created_at,
        p.updated_at,
        c.name AS competitor_name,
        c.domain AS competitor_domain,
        c.logo_url AS competitor_logo,
        cat.name AS category_name,
        ph.price AS current_price,
        ph.original_price,
        ph.discount_percentage,
        ph.in_stock,
        ph.rating_score,
        ph.rating_count,
        ph.extracted_at AS last_price_updated_at
      FROM products p
      INNER JOIN competitors c ON p.competitor_id = c.id
      LEFT JOIN categories cat ON p.category_id = cat.id
      LEFT JOIN LATERAL (
        SELECT price, original_price, discount_percentage, in_stock, rating_score, rating_count, extracted_at
        FROM price_history
        WHERE product_id = p.id
        ORDER BY extracted_at DESC
        LIMIT 1
      ) ph ON TRUE
      ${whereClause}
      ORDER BY p.updated_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++};
    `;

    values.push(limit, offset);
    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Busca detalhes completos de um produto específico pelo ID.
   */
  static async findById(id: string) {
    const sql = `
      SELECT 
        p.id,
        p.sku,
        p.title,
        p.description,
        p.product_url,
        p.image_url,
        p.brand,
        p.target_price,
        p.created_at,
        p.updated_at,
        c.name AS competitor_name,
        c.domain AS competitor_domain,
        cat.name AS category_name
      FROM products p
      INNER JOIN competitors c ON p.competitor_id = c.id
      LEFT JOIN categories cat ON p.category_id = cat.id
      WHERE p.id = $1 LIMIT 1;
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  /**
   * Busca a série temporal de histórico de preços para alimentar os gráficos do Dashboard.
   */
  static async findPriceHistory(productId: string, limit: number = 30) {
    const sql = `
      SELECT 
        id,
        price,
        original_price,
        discount_percentage,
        in_stock,
        rating_score,
        rating_count,
        extracted_at
      FROM price_history
      WHERE product_id = $1
      ORDER BY extracted_at ASC
      LIMIT $2;
    `;
    const result = await query(sql, [productId, limit]);
    return result.rows;
  }

  /**
   * Cria um produto manualmente via interface, resolvendo IDs de concorrência e categorias.
   */
  static async createManualProduct(data: {
    title: string;
    description?: string;
    brand: string;
    product_url: string;
    image_url?: string;
    current_price: number;
    original_price?: number;
    target_price?: number;
    competitor_name?: string;
    category_name?: string;
    review_text?: string;
    rating?: number;
  }) {
    const compName = data.competitor_name || (data as any).marketplace || 'Outro Concorrente';
    const catName = data.category_name || (data as any).category_id || 'Geral';

    // 1. Resolver Competitor ID
    let compRes = await query('SELECT id FROM competitors WHERE name ILIKE $1 LIMIT 1', [compName]);
    let competitorId = compRes.rows[0]?.id;
    if (!competitorId) {
      const newComp = await query(
        'INSERT INTO competitors (name, domain) VALUES ($1, $2) RETURNING id',
        [compName, `${compName.toLowerCase().replace(/\s+/g, '')}.com.br`]
      );
      competitorId = newComp.rows[0].id;
    }

    // 2. Resolver Category ID
    let catRes = await query('SELECT id FROM categories WHERE name ILIKE $1 LIMIT 1', [catName]);
    let categoryId = catRes.rows[0]?.id;
    if (!categoryId) {
      const newCat = await query(
        'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id',
        [catName, `Categoria ${catName}`]
      );
      categoryId = newCat.rows[0].id;
    }

    // 3. Inserir Produto
    const sku = `${data.brand.substring(0, 4).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    const prodRes = await query(
      `INSERT INTO products (competitor_id, category_id, sku, title, description, product_url, image_url, brand, target_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [
        competitorId,
        categoryId,
        sku,
        data.title,
        data.description || '',
        data.product_url,
        data.image_url || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&q=80',
        data.brand,
        data.target_price || data.current_price
      ]
    );
    const productId = prodRes.rows[0].id;

    // 4. Calcular desconto inicial e inserir Histórico de Preço
    const origPrice = data.original_price || data.current_price;
    const discount = origPrice > data.current_price 
      ? Math.round(((origPrice - data.current_price) / origPrice) * 100 * 100) / 100 
      : 0;

    await query(
      `INSERT INTO price_history (product_id, price, original_price, discount_percentage, in_stock, rating_score, rating_count)
       VALUES ($1, $2, $3, $4, TRUE, $5, 1)`,
      [productId, data.current_price, origPrice, discount, data.rating || 5.0]
    );

    // 5. Inserir Review inicial se fornecida
    if (data.review_text && data.review_text.trim().length > 0) {
      await query(
        `INSERT INTO product_reviews (product_id, author, rating, title, review_text, sentiment_label, sentiment_score, processed_at)
         VALUES ($1, 'Usuário (Cadastro)', $2, 'Avaliação Inicial', $3, 'positive', 0.8500, NOW())`,
        [productId, data.rating || 5.0, data.review_text]
      );
    }

    return await this.findById(productId);
  }
}
