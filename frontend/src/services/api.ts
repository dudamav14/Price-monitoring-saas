import axios from 'axios';
import { Product, DashboardSummary, PriceHistoryPoint, SentimentStats, ReviewItem } from '../types';

const API_BASE_URL = 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const fetchHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const fetchProducts = async (params?: { categoryId?: string; competitorId?: string; search?: string }) => {
  const response = await api.get<{ success: boolean; count: number; data: Product[] }>('/products', { params });
  return response.data;
};

export const fetchProductById = async (id: string) => {
  const response = await api.get<{
    success: boolean;
    data: {
      product: Product;
      priceHistory: PriceHistoryPoint[];
      sentimentStats: SentimentStats;
      recentReviews: ReviewItem[];
    };
  }>(`/products/${id}`);
  return response.data;
};

export const fetchDashboardSummary = async () => {
  const response = await api.get<{ success: boolean; data: DashboardSummary }>('/analytics/dashboard');
  return response.data;
};

export const triggerScraperPipeline = async () => {
  const response = await api.post<{ success: boolean; message: string }>('/pipeline/trigger');
  return response.data;
};

export const extractProductData = async (url: string) => {
  const response = await api.post<{
    success: boolean;
    data: {
      title: string;
      image_url: string;
      description: string;
      current_price: number;
      brand: string;
    };
  }>('/products/extract', { url });
  return response.data;
};
