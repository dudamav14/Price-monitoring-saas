import express from 'express';
import cors from 'cors';
import routes from './routes';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Montagem das rotas versionadas da API
app.use('/api/v1', routes);

// Middleware de tratamento de rota não encontrada (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Rota não encontrada: ${req.method} ${req.originalUrl}`
  });
});

// Middleware global de tratamento de erros
app.use(errorHandler);

export default app;
