import React from 'react';
import { ExternalLink, Eye, Star, TrendingDown, Tag, Store, CheckCircle, XCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onSelectProduct: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, isLoading, onSelectProduct }) => {
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-8 border border-slate-800/80 text-center animate-pulse">
        <div className="w-12 h-12 rounded-full bg-slate-800 mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Carregando catálogo de inteligência de mercado...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 border border-slate-800/80 text-center">
        <Tag className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-white mb-1">Nenhum produto encontrado</h3>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          Tente alterar o termo de pesquisa ou limpar os filtros de categoria e concorrente selecionados.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden mb-8 shadow-glass">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/80 border-b border-slate-800 uppercase tracking-wider text-slate-400 font-semibold">
            <tr>
              <th className="px-5 py-4">Produto & Categoria</th>
              <th className="px-5 py-4">Marketplace</th>
              <th className="px-5 py-4 text-right">Preço Atual</th>
              <th className="px-5 py-4 text-center">Desconto</th>
              <th className="px-5 py-4 text-center">Avaliação</th>
              <th className="px-5 py-4 text-center">Estoque</th>
              <th className="px-5 py-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {products.map((product) => {
              const discount = parseFloat(product.discount_percentage || '0');
              const isDeal = discount >= 15.0;

              return (
                <tr 
                  key={product.id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectProduct(product)}
                >
                  {/* Produto & Categoria */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.image_url} 
                        alt={product.title} 
                        className="w-12 h-12 object-contain rounded-xl bg-slate-900/80 p-1 border border-slate-800 group-hover:scale-105 transition-transform"
                      />
                      <div className="max-w-xs">
                        <div className="font-semibold text-slate-100 text-sm line-clamp-1 group-hover:text-indigo-400 transition-colors">
                          {product.title}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-slate-400 font-medium">
                            {product.brand}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800/80 text-slate-300 border border-slate-700/50">
                            {product.category_name || 'Geral'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Marketplace Concorrente */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Store className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-medium text-slate-200">{product.competitor_name}</span>
                    </div>
                  </td>

                  {/* Preço Atual & Preço Original */}
                  <td className="px-5 py-4 text-right">
                    <div className="text-sm font-bold text-emerald-400 font-sans">
                      R$ {parseFloat(product.current_price || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    {parseFloat(product.original_price || '0') > parseFloat(product.current_price || '0') && (
                      <div className="text-[11px] text-slate-500 line-through">
                        R$ {parseFloat(product.original_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    )}
                  </td>

                  {/* Desconto Badge */}
                  <td className="px-5 py-4 text-center">
                    {discount > 0 ? (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                        isDeal 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-pulse' 
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}>
                        <TrendingDown className="w-3 h-3" />
                        -{discount}%
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Normal</span>
                    )}
                  </td>

                  {/* Rating */}
                  <td className="px-5 py-4 text-center">
                    <div className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-lg border border-amber-500/20 font-semibold text-xs">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {product.rating_score || '4.8'}
                    </div>
                  </td>

                  {/* Estoque Status */}
                  <td className="px-5 py-4 text-center">
                    {product.in_stock ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium text-xs">
                        <CheckCircle className="w-3.5 h-3.5" /> Disponível
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-medium text-xs">
                        <XCircle className="w-3.5 h-3.5" /> Esgotado
                      </span>
                    )}
                  </td>

                  {/* Ações */}
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors cursor-pointer"
                        title="Ver Análise IA & Gráficos"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a
                        href={product.product_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                        title="Abrir no E-commerce"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
