import app from './app';
import { env } from './config/env';
import { pool } from './config/database';

const server = app.listen(env.PORT, async () => {
  console.log('=================================================================');
  console.log(`🚀 SERVIDOR BACKEND (NODE.JS + TS) RODANDO NA PORTA ${env.PORT}`);
  console.log(`🌐 API disponível em: http://localhost:${env.PORT}/api/v1/health`);
  console.log('=================================================================');

  // Testar conexão inicial com o PostgreSQL
  try {
    const client = await pool.connect();
    console.log('✅ Conexão com o PostgreSQL restabelecida e testada com sucesso!');
    client.release();
  } catch (err: any) {
    console.error('⚠️ Atenção: Não foi possível estabelecer a conexão inicial com o PostgreSQL:', err.message);
  }
});

// Tratamento gracioso de encerramento do processo
process.on('SIGTERM', () => {
  console.log('👋 Encerrando servidor backend graciosamente...');
  server.close(() => {
    pool.end();
    console.log('🔒 Pool do PostgreSQL encerrado.');
  });
});
