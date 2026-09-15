export interface Product {
  id: string;
  sku: string;
  title: string;
  description: string;
  product_url: string;
  image_url: string;
  brand: string;
  target_price: string;
  created_at: string;
  updated_at: string;
  competitor_name: string;
  competitor_domain: string;
  competitor_logo: string;
  category_name: string;
  current_price: string;
  original_price: string;
  discount_percentage: string;
  in_stock: boolean;
  rating_score: string;
  rating_count: number;
  last_price_updated_at: string;
}

export interface PriceHistoryPoint {
  id: string;
  price: string;
  original_price: string;
  discount_percentage: string;
  in_stock: boolean;
  rating_score: string;
  rating_count: number;
  extracted_at: string;
}

export interface SentimentStats {
  total_reviews: number;
  positive_count: number;
  neutral_count: number;
  negative_count: number;
  positive_percentage: number;
  neutral_percentage: number;
  negative_percentage: number;
  average_confidence: number;
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  title: string;
  review_text: string;
  sentiment_label: 'positive' | 'neutral' | 'negative';
  sentiment_score: number;
  extracted_at: string;
}

export interface DashboardKPIs {
  total_products: number;
  total_competitors: number;
  average_market_discount: number;
  total_reviews: number;
}

export interface DashboardSummary {
  kpis: DashboardKPIs;
  sentiment_distribution: SentimentStats;
  top_deals: {
    id: string;
    title: string;
    image_url: string;
    competitor_name: string;
    price: string;
    original_price: string;
    discount_percentage: string;
  }[];
}
