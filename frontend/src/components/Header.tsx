import React, { useState } from 'react';
import { Activity, RefreshCw, Sparkles, ShoppingBag, Plus } from 'lucide-react';
import { triggerScraperPipeline } from '../services/api';

interface HeaderProps {
  apiOnline: boolean;
  onRefresh: () => void;
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ apiOnline, onRefresh, onOpenAddModal }) => {
  const [isTriggering, setIsTriggering] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleTriggerPipeline = async () => {
    try {
      setIsTriggering(true);
      const res = await triggerScraperPipeline();
      setToastMessage("🚀 Scraping e IA iniciados em background!");
      setTimeout(() => setToastMessage(null), 4000);
      setTimeout(() => onRefresh(), 2000);
    } catch (err) {
      setToastMessage("⚠️ Erro ao acionar o pipeline.");
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-slate-800/80 px-6 py-4 mb-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-glow-indigo flex items-center justify-center">
            <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight font-sans text-white">
                Market<span className="gradient-text-indigo">Pulse</span> AI
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                SaaS v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Inteligência de Mercado, Variação de Preços & NLP Sentimentos
            </p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-3">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg animate-pulse">
              {toastMessage}
            </div>
          )}

          {/* API Health Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
            <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]' : 'bg-rose-500'}`} />
            <span className="text-slate-300 font-medium">{apiOnline ? 'API Conectada' : 'API Desconectada'}</span>
          </div>

          {/* Trigger Pipeline Action Button */}
          <button
            onClick={handleTriggerPipeline}
            disabled={isTriggering}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 text-indigo-400 ${isTriggering ? 'animate-spin' : ''}`} />
            {isTriggering ? 'Scraping...' : 'Scraper & IA'}
          </button>

          {/* Add Product Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-cyan-500 rounded-lg shadow-glow-indigo transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Novo Produto
          </button>
        </div>

      </div>
    </header>
  );
};
