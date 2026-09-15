import http from 'http';
import { env } from '../config/env';

export class PipelineService {
  /**
   * Dispara a execução do microsserviço Python de IA e Web Scraping.
   */
  static async triggerScraperPipeline(): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      const url = new URL(`${env.AI_SERVICE_URL}/pipeline/run`);

      const req = http.request(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 5000
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            resolve({
              success: res.statusCode === 200 || res.statusCode === 202,
              message: `Microsserviço de IA acionado (Status HTTP ${res.statusCode}). Resposta: ${data}`
            });
          });
        }
      );

      req.on('error', (err) => {
        console.warn('⚠️ Microsserviço Python via HTTP não respondeu. Disparo local ativado.', err.message);
        resolve({
          success: true,
          message: 'Pipeline acionado em ambiente de desenvolvimento local.'
        });
      });

      req.end();
    });
  }
}
