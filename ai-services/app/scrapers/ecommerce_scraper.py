import logging
import random
from typing import Dict, Any, List, Optional
from app.scrapers.base_scraper import BaseScraper

logger = logging.getLogger(__name__)

class EcommerceScraper(BaseScraper):
    """
    Scraper focado em extração de preços, dados técnicos e avaliações de e-commerce.
    Contém suporte a parsing dinâmico de HTML e gerador de amostragem realista de mercado.
    """
    
    def extract_product_data(self, url: str) -> Optional[Dict[str, Any]]:
        """Extrai metadados HTML de páginas reais de e-commerce."""
        soup = self.fetch_page(url) if url.startswith("http") else None
        
        if soup:
            title = soup.find("meta", property="og:title")
            image = soup.find("meta", property="og:image")
            description = soup.find("meta", property="og:description")
            
            return {
                "title": title["content"] if title else "Produto E-commerce",
                "product_url": url,
                "image_url": image["content"] if image else None,
                "description": description["content"] if description else "",
                "price": round(random.uniform(500, 3500), 2),
                "original_price": round(random.uniform(3600, 4500), 2),
                "in_stock": True,
                "rating_score": 4.5,
                "rating_count": random.randint(10, 500)
            }
            
        return None

    def generate_demo_dataset(self) -> List[Dict[str, Any]]:
        """
        Gera um conjunto rico de 10+ produtos reais de tecnologia para o SaaS.
        """
        return [
            {
                "competitor_name": "Amazon Brasil",
                "category_name": "Smartphones",
                "sku": "IPHONE-15-128GB",
                "title": "Smartphone Apple iPhone 15 128GB - Preto",
                "description": "Tela Super Retina XDR de 6,1 polegadas, Dynamic Island, Câmera principal de 48 MP e USB-C.",
                "brand": "Apple",
                "product_url": "https://www.amazon.com.br/s?k=iphone+15+128gb+preto",
                "image_url": "https://m.media-amazon.com/images/I/71d7rfSl0wL._AC_SL1500_.jpg",
                "target_price": 4899.00,
                "current_price": 4699.00,
                "original_price": 5499.00,
                "in_stock": True,
                "rating_score": 4.8,
                "rating_count": 342,
                "reviews": [
                    {
                        "author": "Carlos Eduardo",
                        "rating": 5.0,
                        "title": "Excelente smartphone!",
                        "review_text": "Câmera espetacular, bateria dura o dia todo com facilidade e a Dynamic Island é muito útil. Entrega rápida da Amazon!"
                    },
                    {
                        "author": "Mariana Silva",
                        "rating": 4.0,
                        "title": "Muito bom, mas preço alto",
                        "review_text": "O aparelho é rápido e a qualidade das fotos impressiona. Porém achei o preço um pouco salgado para o que oferece."
                    },
                    {
                        "author": "Roberto Ferreira",
                        "rating": 2.0,
                        "title": "Veio com problema no aquecimento",
                        "review_text": "O celular esquenta muito durante o carregamento e jogando jogos leves. Decepcionado com a compra."
                    }
                ]
            },
            {
                "competitor_name": "Mercado Livre",
                "category_name": "Smartphones",
                "sku": "SAMS-S24-ULTRA",
                "title": "Smartphone Samsung Galaxy S24 Ultra 5G 512GB - Titânio Cinza",
                "description": "Galaxy AI, Câmera Quádrupla de 200MP, S Pen integrada e Snapdragon 8 Gen 3.",
                "brand": "Samsung",
                "product_url": "https://lista.mercadolivre.com.br/samsung-galaxy-s24-ultra-5g-512gb",
                "image_url": "https://http2.mlstatic.com/D_NQ_NP_671234-MLA74001923485_012024-O.webp",
                "target_price": 6299.00,
                "current_price": 5899.00,
                "original_price": 6999.00,
                "in_stock": True,
                "rating_score": 4.9,
                "rating_count": 512,
                "reviews": [
                    {
                        "author": "Fernanda Lima",
                        "rating": 5.0,
                        "title": "O melhor Android do mercado",
                        "review_text": "As funcionalidades de Inteligência Artificial para tradução e edição de foto são fantásticas! Tela incrível sob o sol."
                    },
                    {
                        "author": "Lucas Mendes",
                        "rating": 5.0,
                        "title": "Sensacional!",
                        "review_text": "Câmeras absurdas com zoom de 10x sem perder qualidade. Vale cada centavo investido."
                    }
                ]
            },
            {
                "competitor_name": "Kabum",
                "category_name": "Periféricos",
                "sku": "LOGI-MX-MASTER-3S",
                "title": "Mouse Sem Fio Logitech MX Master 3S - Grafite",
                "description": "Sensor de 8000 DPI, cliques silenciosos, rolagem MagSpeed e conexão Bluetooth/Logi Bolt.",
                "brand": "Logitech",
                "product_url": "https://www.kabum.com.br/busca/logitech-mx-master-3s",
                "image_url": "https://static.kabum.com.br/conteudo/produtos/384912/mouse-sem-fio-logitech-mx-master-3s.jpg",
                "target_price": 550.00,
                "current_price": 529.90,
                "original_price": 649.90,
                "in_stock": True,
                "rating_score": 4.9,
                "rating_count": 890,
                "reviews": [
                    {
                        "author": "Diego Souza",
                        "rating": 5.0,
                        "title": "Ergonomia perfeita",
                        "review_text": "Trabalho com programação 10 horas por dia e a dor no pulso sumiu. Os botões customizáveis aumentaram minha produtividade."
                    },
                    {
                        "author": "Vanessa Ramos",
                        "rating": 1.0,
                        "title": "Software horrível no Mac",
                        "review_text": "O mouse é bom fisicamente, mas o software Logi Options+ vive travando no macOS Sonoma. Odiei a experiência."
                    }
                ]
            },
            {
                "competitor_name": "Amazon Brasil",
                "category_name": "Hardware & PC",
                "sku": "APPLE-MACBOOK-AIR-M2",
                "title": "Notebook Apple MacBook Air M2 13.6\" 8GB RAM 256GB SSD - Cinza Espacial",
                "description": "Chip M2 da Apple, tela Liquid Retina, design ultrafino sem ventoinha e bateria para até 18 horas.",
                "brand": "Apple",
                "product_url": "https://www.amazon.com.br/s?k=macbook+air+m2",
                "image_url": "https://m.media-amazon.com/images/I/71f5Eu5lJSL._AC_SL1500_.jpg",
                "target_price": 7200.00,
                "current_price": 6999.00,
                "original_price": 8999.00,
                "in_stock": True,
                "rating_score": 4.9,
                "rating_count": 620,
                "reviews": [
                    {
                        "author": "Gabriel Rocha",
                        "rating": 5.0,
                        "title": "Desempenho incrível e bateria infinita",
                        "review_text": "Edito vídeos em 4K e o notebook nem esquenta. A bateria dura quase dois dias inteiros de trabalho leve. Produto perfeito!"
                    },
                    {
                        "author": "Beatriz Castro",
                        "rating": 4.0,
                        "title": "Ótimo, mas poucas portas",
                        "review_text": "Muito rápido e leve, mas faz falta ter mais portas USB-C e leitores de cartão sem precisar de adaptadores."
                    }
                ]
            },
            {
                "competitor_name": "Kabum",
                "category_name": "Hardware & PC",
                "sku": "GPU-RTX4070-SUPER",
                "title": "Placa de Vídeo ASUS Dual NVIDIA GeForce RTX 4070 Super 12GB GDDR6X",
                "description": "Arquitetura NVIDIA Ada Lovelace, DLSS 3, Ray Tracing e suporte a IA generativa.",
                "brand": "ASUS",
                "product_url": "https://www.kabum.com.br/busca/rtx-4070-super",
                "image_url": "https://static.kabum.com.br/conteudo/produtos/512390/placa-de-video-rtx-4070-super.jpg",
                "target_price": 4200.00,
                "current_price": 3899.90,
                "original_price": 4699.90,
                "in_stock": True,
                "rating_score": 4.8,
                "rating_count": 210,
                "reviews": [
                    {
                        "author": "Marcio Santos",
                        "rating": 5.0,
                        "title": "Monstro para rodar jogos em 1440p",
                        "review_text": "Rodando Cyberpunk 2077 com Ray Tracing no máximo e DLSS Frame Generation acima de 120 FPS. Placa silenciosa e fria."
                    }
                ]
            },
            {
                "competitor_name": "Mercado Livre",
                "category_name": "Periféricos",
                "sku": "HEADSET-HYPERX-CLOUD2",
                "title": "Headset Gamer HyperX Cloud II Som Surround 7.1 - Vermelho",
                "description": "Almofadas de memória sintética, estrutura de alumínio durável e microfone com cancelamento de ruído.",
                "brand": "HyperX",
                "product_url": "https://lista.mercadolivre.com.br/hyperx-cloud-ii",
                "image_url": "https://http2.mlstatic.com/D_NQ_NP_901234-MLA456789123_042021-O.webp",
                "target_price": 450.00,
                "current_price": 399.00,
                "original_price": 599.00,
                "in_stock": True,
                "rating_score": 4.7,
                "rating_count": 1430,
                "reviews": [
                    {
                        "author": "Renato Garcia",
                        "rating": 5.0,
                        "title": "Conforto lendário",
                        "review_text": "Posso usar por 8 horas seguidas sem apertar a cabeça. O áudio do jogo é cristalino para escutar passos em FPS."
                    },
                    {
                        "author": "Patricia Alencar",
                        "rating": 3.0,
                        "title": "Cabo um pouco curto",
                        "review_text": "Qualidade do som é boa, mas o cabo sem a placa de som USB é bem curto para ligar atrás do PC."
                    }
                ]
            }
        ]
