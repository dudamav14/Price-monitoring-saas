import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Erro Não Tratado na API:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor.';

  return res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
