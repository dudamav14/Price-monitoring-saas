import { Pool, QueryResultRow } from 'pg';
import { env } from './env';

// Pool principal de conexões com o PostgreSQL
export const pool = new Pool({
  host: env.POSTGRES_HOST === 'database' ? '127.0.0.1' : env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000,
});

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no pool de conexões do PostgreSQL:', err);
});

export const query = async <T extends QueryResultRow = any>(
  text: string,
  params?: any[]
) => {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    if (env.NODE_ENV === 'development') {
      console.log(`⏱️ Query executada (${duration}ms): ${text.substring(0, 80)}...`);
    }
    return res;
  } catch (error) {
    console.error('❌ Erro de SQL Query:', { text, error });
    throw error;
  }
};
