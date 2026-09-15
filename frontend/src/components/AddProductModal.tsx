import React, { useState } from 'react';
import { X, Plus, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [categoryName, setCategoryName] = useState('Smartphones');
  const [competitorName, setCompetitorName] = useState('Amazon Brasil');
  const [productUrl, setProductUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState('5.0');

  const [loading, setLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExtract = async () => {
    if (!productUrl) {
      setErrorMsg('Cole a URL do produto primeiro para buscar os dados.');
      return;
    }
    
    setErrorMsg(null);
    setIsExtracting(true);

    try {
      const response = await api.post('/products/extract', { url: productUrl });
      const data = response.data?.data;
      
      if (data) {
        if (data.title) setTitle(data.title);
        if (data.brand) setBrand(data.brand);
        if (data.image_url) setImageUrl(data.image_url);
        if (data.current_price) {
          setCurrentPrice(data.current_price.toString());
          setOriginalPrice(data.current_price.toString());
        }
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Não foi possível extrair os dados automaticamente.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title || !brand || !productUrl || !currentPrice) {
      setErrorMsg('Por favor, preencha os campos obrigatórios (*).');
      return;
    }

    const priceNum = parseFloat(currentPrice.replace(',', '.'));
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMsg('O Preço Atual deve ser um número maior que zero.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/products', {
        title,
        brand,
        category_name: categoryName,
        competitor_name: competitorName,
        product_url: productUrl,
        image_url: imageUrl || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&q=80',
        current_price: priceNum,
        original_price: originalPrice ? parseFloat(originalPrice.replace(',', '.')) : priceNum,
        target_price: targetPrice ? parseFloat(targetPrice.replace(',', '.')) : priceNum,
        review_text: reviewText,
        rating: parseFloat(rating)
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Erro ao cadastrar o produto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-xl rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Cadastrar Produto Manualmente</h2>
              <p className="text-xs text-slate-400">Alimente a base de dados em tempo real</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* URLs */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">URL do Produto *</label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                placeholder="Cole o link do Mercado Livre, Amazon, Kabum..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleExtract}
                disabled={isExtracting}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-xl font-semibold whitespace-nowrap flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {isExtracting ? 'Buscando...' : 'Auto-preencher'}
              </button>
            </div>
          </div>

          {/* Título & Marca */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Título do Produto *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: PlayStation 5 Slim Edição Digital"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Marca *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ex: Sony, Apple, Dell"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Categoria & Concorrente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Categoria *</label>
              <select
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Smartphones">Smartphones</option>
                <option value="Periféricos">Periféricos</option>
                <option value="Hardware & PC">Hardware & PC</option>
                <option value="Consoles & Games">Consoles & Games</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Marketplace / Loja *</label>
              <select
                value={competitorName}
                onChange={(e) => setCompetitorName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Amazon Brasil">Amazon Brasil</option>
                <option value="Mercado Livre">Mercado Livre</option>
                <option value="Kabum">Kabum</option>
                <option value="Magazine Luiza">Magazine Luiza</option>
              </select>
            </div>
          </div>

          {/* Preços */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Preço Atual (R$) *</label>
              <input
                type="text"
                required
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                placeholder="Ex: 3799.90"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-emerald-400 font-bold placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Preço Original (R$)</label>
              <input
                type="text"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="Ex: 4299.90"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Preço Alvo (R$)</label>
              <input
                type="text"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="Ex: 3500.00"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-cyan-400 font-bold placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Avaliação Inicial para Processamento de IA */}
          <div className="pt-2 border-t border-slate-800">
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Avaliação de Cliente para Processamento NLP
            </label>
            <textarea
              rows={2}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Ex: Console fantástico! Silencioso e os gráficos são incríveis. Valeu muito a pena."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Botões */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl font-bold shadow-glow-indigo transition-all cursor-pointer"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
