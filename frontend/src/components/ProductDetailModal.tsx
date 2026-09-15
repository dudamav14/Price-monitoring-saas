import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Star, BrainCircuit, CheckCircle, AlertCircle, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { Product, PriceHistoryPoint, SentimentStats, ReviewItem } from '../types';
import { fetchProductById } from '../services/api';
import { PriceHistoryChart } from './PriceHistoryChart';
import { SentimentDonutChart } from './SentimentDonutChart';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryPoint[]>([]);
  const [sentimentStats, setSentimentStats] = useState<SentimentStats | undefined>();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  useEffect(() => {
    if (!product) return;

    const loadDetails = async () => {
      setLoading(true);
      try {
        const data = await fetchProductById(product.id);
        if (data.success) {
          setPriceHistory(data.data.priceHistory);
          setSentimentStats(data.data.sentimentStats);
          setReviews(data.data.recentReviews);
        }
      } catch (err) {
        console.error('Erro ao carregar detalhes do produto:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [product]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-4xl max-h-[90vh] rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {product.category_name || 'Geral'}
            </span>
            <span className="text-xs text-slate-400 font-medium">SKU: {product.sku || product.id.substring(0, 8)}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo Rolável */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Informações Principais do Produto */}
          <div className="flex flex-col md:flex-row gap-6 items-start bg-slate-900/60 rounded-2xl p-5 border border-slate-800/80">
            <img 
              src={product.image_url} 
              alt={product.title} 
              className="w-24 h-24 object-contain rounded-xl bg-slate-950 p-2 border border-slate-800 mx-auto md:mx-0"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-4 mb-1">
                <h2 className="text-lg font-bold text-white leading-snug">{product.title}</h2>
                <a
                  href={product.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold shrink-0 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20"
                >
                  Ver no {product.competitor_name}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">{product.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Preço Atual</span>
                  <span className="text-lg font-extrabold text-emerald-400">
                    R$ {parseFloat(product.current_price || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {product.original_price && (
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Preço Original</span>
                    <span className="text-sm text-slate-400 line-through">
                      R$ {parseFloat(product.original_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                {product.target_price && (
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Preço Alvo</span>
                    <span className="text-sm font-semibold text-cyan-400">
                      R$ {parseFloat(product.target_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Gráficos em Grid 2 colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PriceHistoryChart data={priceHistory} productTitle={product.title} />
            </div>
            <div>
              <SentimentDonutChart stats={sentimentStats} />
            </div>
          </div>

          {/* Avaliações Classificadas por NLP Transformers */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              Avaliações Analisadas por IA (NLP Transformers)
            </h3>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500">Nenhuma avaliação encontrada para este produto.</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => {
                  const isPos = rev.sentiment_label === 'positive';
                  const isNeg = rev.sentiment_label === 'negative';

                  return (
                    <div 
                      key={rev.id} 
                      className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 transition-all hover:border-slate-700"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">{rev.author || 'Cliente'}</span>
                          <span className="flex items-center text-xs text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">
                            <Star className="w-3 h-3 fill-amber-400 mr-1" /> {rev.rating}
                          </span>
                        </div>

                        {/* Sentiment Label Badge */}
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            isPos ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                            isNeg ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                            'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                          }`}>
                            {isPos && <ThumbsUp className="w-3 h-3" />}
                            {isNeg && <ThumbsDown className="w-3 h-3" />}
                            {!isPos && !isNeg && <Minus className="w-3 h-3" />}
                            {rev.sentiment_label.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Confiança: {(rev.sentiment_score * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {rev.title && <h4 className="text-xs font-semibold text-slate-200 mb-1">{rev.title}</h4>}
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{rev.review_text}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
