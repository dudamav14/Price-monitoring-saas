import React from 'react';
import { Package, Store, TrendingDown, MessageSquare, BrainCircuit } from 'lucide-react';
import { DashboardKPIs, SentimentStats } from '../types';

interface KpiCardsProps {
  kpis?: DashboardKPIs;
  sentimentStats?: SentimentStats;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ kpis, sentimentStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      
      {/* Card 1: Total Produtos Monitorados */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-indigo-500/30 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Produtos Monitorados</span>
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
            <Package className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-extrabold text-white font-sans">
            {kpis ? kpis.total_products : '--'}
          </span>
          <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            Ativos no Mercado
          </span>
        </div>
      </div>

      {/* Card 2: Lojas Concorrentes */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-cyan-500/30 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Marketplaces Monitorados</span>
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
            <Store className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-extrabold text-white font-sans">
            {kpis ? kpis.total_competitors : '--'}
          </span>
          <span className="text-xs text-slate-400">Amazon, ML, Kabum</span>
        </div>
      </div>

      {/* Card 3: Desconto Médio do Mercado */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-emerald-500/30 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Média de Desconto</span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-extrabold text-emerald-400 font-sans">
            {kpis ? `${kpis.average_market_discount}%` : '--'}
          </span>
          <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            Economia Real
          </span>
        </div>
      </div>

      {/* Card 4: Reviews & NLP Sentiment Satisfação */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-indigo-500/30 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Satisfação Clientes (IA)</span>
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
            <BrainCircuit className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-extrabold text-indigo-300 font-sans">
            {sentimentStats ? `${sentimentStats.positive_percentage}%` : '--'}
          </span>
          <span className="text-xs text-slate-400">
            {sentimentStats ? `${sentimentStats.total_reviews} avaliações` : 'NLP BERT'}
          </span>
        </div>
      </div>

    </div>
  );
};
