import sys
import os
import logging
from typing import Dict, Any

# Adiciona o diretório atual ao sys.path para resolução de imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db import (
    get_competitor_by_name, 
    get_category_by_name, 
    upsert_product, 
    save_price_history, 
    save_product_reviews, 
    log_scraping_job
)
from app.scrapers.ecommerce_scraper import EcommerceScraper
from app.analytics.price_analyzer import PriceAnalyzer
from app.nlp.sentiment_model import SentimentAnalyzer

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("PipelineRunner")

def run_full_pipeline():
    """
    Executa o pipeline completo da Fase 2:
    Web Scraping ➔ Análise Estatística de Preços ➔ Classificação de Sentimentos NLP ➔ Persistência PostgreSQL
    """
    logger.info("=================================================================")
    logger.info("🚀 INICIANDO PIPELINE DE INTELIGÊNCIA DE MERCADO E IA (FASE 2)")
    logger.info("=================================================================")
    
    scraper = EcommerceScraper()
    sentiment_ai = SentimentAnalyzer()
    
    # 1. Coleta de Dados via Scraper
    logger.info("1️⃣ [Scraping] Coletando catálogo e avaliações de produtos...")
    items = scraper.generate_demo_dataset()
    logger.info(f"    ➜ {len(items)} produtos coletados para processamento.")
    
    success_count = 0
    
    for item in items:
        try:
            logger.info(f"\n📦 Processando: {item['title']}")
            
            # Buscar IDs de concorrência e categoria no banco
            competitor = get_competitor_by_name(item['competitor_name'])
            category = get_category_by_name(item['category_name'])
            
            if not competitor:
                logger.warning(f"   ⚠️ Concorrente '{item['competitor_name']}' não encontrado no banco. Pulando.")
                continue
                
            competitor_id = competitor['id']
            category_id = category['id'] if category else None
            
            # 2. Persistir ou Atualizar Produto
            product_data = {
                "competitor_id": competitor_id,
                "category_id": category_id,
                "sku": item.get('sku'),
                "title": item['title'],
                "description": item.get('description'),
                "product_url": item['product_url'],
                "image_url": item.get('image_url'),
                "brand": item.get('brand'),
                "target_price": item.get('target_price')
            }
            
            product_id = upsert_product(product_data)
            logger.info(f"   ✓ Produto cadastrado/atualizado (ID: {product_id})")
            
            # 3. Análise Estatística de Preço (Pandas)
            price_metrics = PriceAnalyzer.calculate_discount_metrics(
                price=item['current_price'], 
                original_price=item.get('original_price', item['current_price'])
            )
            logger.info(f"   📊 [Analytics] Preço Atual: R$ {item['current_price']} | Desconto: {price_metrics['discount_percentage']}% ({price_metrics['status_label']})")
            
            # Persistir Ponto no Histórico de Preços
            price_history_data = {
                "product_id": product_id,
                "price": item['current_price'],
                "original_price": item.get('original_price'),
                "discount_percentage": price_metrics['discount_percentage'],
                "in_stock": item.get('in_stock', True),
                "rating_score": item.get('rating_score'),
                "rating_count": item.get('rating_count', 0)
            }
            save_price_history(price_history_data)
            logger.info("   ✓ Histórico de preço registrado com sucesso.")
            
            # 4. Processamento de NLP / Sentimento nas Avaliações
            reviews = item.get('reviews', [])
            processed_reviews = []
            
            for rev in reviews:
                # Inferência do Modelo de IA NLP (Transformers / BERT)
                nlp_res = sentiment_ai.analyze(rev['review_text'])
                
                rev_processed = {
                    "author": rev.get('author'),
                    "rating": rev.get('rating'),
                    "title": rev.get('title'),
                    "review_text": rev['review_text'],
                    "sentiment_label": nlp_res['sentiment_label'],
                    "sentiment_score": nlp_res['sentiment_score']
                }
                processed_reviews.append(rev_processed)
                logger.info(f"   🤖 [NLP IA] Review: \"{rev['review_text'][:45]}...\" ➔ Rótulo: [{nlp_res['sentiment_label'].upper()}] (Confiança: {nlp_res['sentiment_score']*100:.1f}%)")
            
            # Persistir Avaliações no PostgreSQL
            inserted_reviews = save_product_reviews(product_id, processed_reviews)
            logger.info(f"   ✓ {inserted_reviews} avaliações gravadas no banco com classificação NLP.")
            
            success_count += 1
            
        except Exception as e:
            logger.error(f"   ❌ Erro ao processar item {item.get('title')}: {e}")
            log_scraping_job(target_url=item.get('product_url', 'N/A'), status="failed", error_message=str(e))

    # Registrar Log de Execução no Banco
    log_scraping_job(target_url="market_intelligence_pipeline", status="success", items_scraped=success_count)
    
    logger.info("\n=================================================================")
    logger.info(f"🎉 PIPELINE CONCLUÍDO! {success_count} produtos e avaliações processados.")
    logger.info("=================================================================")

if __name__ == "__main__":
    run_full_pipeline()
