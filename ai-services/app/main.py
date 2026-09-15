from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import logging

from app.nlp.sentiment_model import SentimentAnalyzer
from app.analytics.price_analyzer import PriceAnalyzer
from run_pipeline import run_full_pipeline

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("FastAPI")

app = FastAPI(
    title="Market Intelligence AI & Data Microservice",
    description="Microsserviço Python para Web Scraping, Análise Estatística e NLP (Transformers).",
    version="1.0.0"
)

# Instância única do modelo NLP em memória
sentiment_ai = SentimentAnalyzer()

class SentimentRequest(BaseModel):
    text: str = Field(..., example="O produto chegou super rápido e funciona perfeitamente! Recomendo.")

class SentimentResponse(BaseModel):
    sentiment_label: str
    sentiment_score: float

class PriceMetricsRequest(BaseModel):
    price: float = Field(..., example=4699.00)
    original_price: float = Field(..., example=5499.00)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Market Intelligence AI Microservice",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/analyze/sentiment", response_model=SentimentResponse)
def analyze_sentiment(payload: SentimentRequest):
    """Endpoint para classificação instantânea de sentimentos via NLP."""
    try:
        result = sentiment_ai.analyze(payload.text)
        return result
    except Exception as e:
        logger.error(f"Erro na análise de sentimento: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/price-metrics")
def analyze_price(payload: PriceMetricsRequest):
    """Endpoint para métricas estatísticas de desconto e variação de preço."""
    try:
        metrics = PriceAnalyzer.calculate_discount_metrics(payload.price, payload.original_price)
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/pipeline/run")
def trigger_pipeline(background_tasks: BackgroundTasks):
    """Dispara o pipeline de coleta de dados e processamento de IA em segundo plano."""
    background_tasks.add_task(run_full_pipeline)
    return {
        "message": "Pipeline de Inteligência de Mercado e IA iniciado em background.",
        "status": "triggered"
    }
