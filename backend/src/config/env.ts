import dotenv from 'dotenv';
import path from 'path';

// Carrega as variáveis do arquivo .env da raiz do monorepo ou local
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

export const env = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Configurações do PostgreSQL
  POSTGRES_HOST: process.env.POSTGRES_HOST || 'localhost',
  POSTGRES_PORT: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5433,
  POSTGRES_USER: process.env.POSTGRES_USER || 'postgres',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || 'postgres_secret_key',
  POSTGRES_DB: process.env.POSTGRES_DB || 'market_intelligence',
  
  // URL do microsserviço Python de IA
  AI_SERVICE_URL: process.env.AI_SERVICE_URL || 'http://localhost:8000'
};
