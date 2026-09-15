import pandas as pd
import numpy as np
from typing import Dict, Any, List

class PriceAnalyzer:
    """
    Módulo estatístico em Pandas para análise temporal de preços e detecção de oportunidades.
    """
    
    @staticmethod
    def calculate_discount_metrics(price: float, original_price: float) -> Dict[str, Any]:
        """Calcula variação percentual de desconto e categoriza o estado de oferta."""
        if not original_price or original_price <= 0 or price >= original_price:
            return {
                "discount_percentage": 0.0,
                "status_label": "PRECO_NORMAL",
                "is_deal": False
            }
        
        discount_percentage = round(((original_price - price) / original_price) * 100, 2)
        
        is_deal = discount_percentage >= 15.0  # Desconto acima de 15% é considerado oferta relevante
        status_label = "PROMO_RELAMPAGO" if discount_percentage >= 25.0 else ("OFERTA" if is_deal else "DESCONTO_LEVE")
        
        return {
            "discount_percentage": discount_percentage,
            "status_label": status_label,
            "is_deal": is_deal
        }

    @staticmethod
    def analyze_price_history_dataframe(history_records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Recebe uma lista de registros históricos e executa análises estatísticas via Pandas.
        """
        if not history_records:
            return {}
        
        df = pd.DataFrame(history_records)
        df['price'] = pd.to_numeric(df['price'])
        
        min_price = float(df['price'].min())
        max_price = float(df['price'].max())
        mean_price = round(float(df['price'].mean()), 2)
        std_price = round(float(df['price'].std()), 2) if len(df) > 1 else 0.0
        
        latest_price = float(df.iloc[-1]['price'])
        
        # Preço está no menor patamar histórico?
        is_all_time_low = (latest_price <= min_price)
        
        return {
            "min_price": min_price,
            "max_price": max_price,
            "mean_price": mean_price,
            "std_deviation": std_price,
            "latest_price": latest_price,
            "is_all_time_low": is_all_time_low,
            "records_count": len(df)
        }
