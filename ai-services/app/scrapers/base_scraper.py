import requests
from bs4 import BeautifulSoup
from fake_useragent import UserAgent
import time
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

class BaseScraper:
    """
    Classe Base de Web Scraping.
    Implementa rotação de User-Agents, tratamento de erros e retentativas automáticas.
    """
    def __init__(self, timeout: int = 10, max_retries: int = 3):
        self.timeout = timeout
        self.max_retries = max_retries
        self.ua = UserAgent()

    def _get_headers(self) -> Dict[str, str]:
        """Gera cabeçalhos HTTP simulando um navegador real."""
        return {
            "User-Agent": self.ua.random,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
        }

    def fetch_page(self, url: str) -> Optional[BeautifulSoup]:
        """
        Realiza a requisição HTTP com retentativas (Exponential Backoff).
        Retorna o objeto BeautifulSoup se bem-sucedido.
        """
        for attempt in range(1, self.max_retries + 1):
            try:
                headers = self._get_headers()
                logger.info(f"Scraping [{attempt}/{self.max_retries}]: {url}")
                
                response = requests.get(url, headers=headers, timeout=self.timeout)
                response.raise_for_status()
                
                return BeautifulSoup(response.text, "html.parser")
            except requests.RequestException as e:
                logger.warning(f"Tentativa {attempt} falhou para {url}: {e}")
                if attempt < self.max_retries:
                    time.sleep(2 ** attempt)  # Espere 2s, 4s...
                else:
                    logger.error(f"Falha definitiva ao obter a página: {url}")
                    return None
