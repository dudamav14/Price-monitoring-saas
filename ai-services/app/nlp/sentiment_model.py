import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class SentimentAnalyzer:
    """
    Classificador de Sentimentos NLP para avaliações de consumidores (Reviews).
    Utiliza a arquitetura Transformers (Hugging Face) com fallback resiliente.
    """
    
    def __init__(self):
        self.pipeline = None
        self._initialize_model()

    def _initialize_model(self):
        """Inicializa o pipeline de NLP de forma lazy para otimizar tempo de boot."""
        try:
            from transformers import pipeline
            logger.info("Carregando modelo de Inteligência Artificial NLP (Transformers)...")
            # Modelo multilíngue pré-treinado para análise de sentimentos (1 a 5 estrelas ou POS/NEG)
            self.pipeline = pipeline(
                "sentiment-analysis", 
                model="nlptown/bert-base-multilingual-uncased-sentiment",
                tokenizer="nlptown/bert-base-multilingual-uncased-sentiment"
            )
            logger.info("Modelo de IA NLP carregado com sucesso!")
        except Exception as e:
            logger.warning(f"Não foi possível carregar o modelo pesado do HuggingFace offline ({e}). Utilizando motor de inferência léxica de fallback.")
            self.pipeline = None

    def analyze(self, text: str) -> Dict[str, Any]:
        """
        Analisador de sentimento para um determinado texto de avaliação.
        Retorna o rótulo ('positive', 'neutral', 'negative') e o score de confiança (0.0 a 1.0).
        """
        if not text or len(text.strip()) == 0:
            return {"sentiment_label": "neutral", "sentiment_score": 0.5000}
        
        # Tentativa 1: Pipeline HuggingFace Transformers (Deep Learning)
        if self.pipeline:
            try:
                # O modelo nlptown retorna rótulos como '1 star', '2 stars', ..., '5 stars'
                result = self.pipeline(text[:512])[0]  # Limita a 512 tokens para performance
                label_raw = result['label']
                score = round(float(result['score']), 4)
                
                if '1 star' in label_raw or '2 stars' in label_raw:
                    sentiment_label = "negative"
                elif '3 stars' in label_raw:
                    sentiment_label = "neutral"
                else:  # 4 stars ou 5 stars
                    sentiment_label = "positive"
                    
                return {
                    "sentiment_label": sentiment_label,
                    "sentiment_score": score
                }
            except Exception as e:
                logger.error(f"Erro na inferência Transformers: {e}. Alternando para fallback.")

        # Tentativa 2: Análise Heurística Léxica (Fallback Resiliente para ambientes sem download do modelo)
        return self._rule_based_sentiment(text)

    def _rule_based_sentiment(self, text: str) -> Dict[str, Any]:
        """Regra léxica contextual em Português como mecanismo de resiliência."""
        text_lower = text.lower()
        
        pos_words = ["excelente", "ótimo", "otimo", "incrível", "incrivel", "maravilhoso", "espetacular", "perfeito", "recomendo", "rápido", "rapido", "bom", "gostei", "fantástico"]
        neg_words = ["horrível", "horrivel", "péssimo", "pessimo", "ruim", "decepcionado", "decepção", "decepcao", "problema", "defeito", "esquenta", "odiei", "trava", "lento", "mal"]
        
        pos_count = sum(1 for word in pos_words if word in text_lower)
        neg_count = sum(1 for word in neg_words if word in text_lower)
        
        if pos_count > neg_count:
            score = min(0.70 + (pos_count * 0.10), 0.99)
            return {"sentiment_label": "positive", "sentiment_score": round(score, 4)}
        elif neg_count > pos_count:
            score = min(0.70 + (neg_count * 0.10), 0.99)
            return {"sentiment_label": "negative", "sentiment_score": round(score, 4)}
        else:
            return {"sentiment_label": "neutral", "sentiment_score": 0.6000}
