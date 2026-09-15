import React from 'react';
import { Search, Filter, Store, Tag } from 'lucide-react';

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedCompetitor: string;
  onCompetitorChange: (competitor: string) => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedCompetitor,
  onCompetitorChange
}) => {
  const categories = ['Todas', 'Smartphones', 'Periféricos', 'Hardware & PC'];
  const competitors = ['Todas', 'Amazon Brasil', 'Mercado Livre', 'Kabum'];

  return (
    <div className="glass-card rounded-2xl p-4 border border-slate-800/80 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
      
      {/* Campo de Pesquisa Instantânea */}
      <div className="relative w-full md:w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Pesquisar por produto, marca ou modelo..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filtros de Categoria e Concorrente */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        
        {/* Filtro de Categoria */}
        <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 rounded-xl p-1 text-xs">
          <Tag className="w-3.5 h-3.5 text-slate-400 ml-2" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat === 'Todas' ? '' : cat)}
              className={`px-2.5 py-1 rounded-lg transition-all font-medium cursor-pointer ${
                (selectedCategory === cat || (cat === 'Todas' && !selectedCategory))
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filtro de Concorrente */}
        <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 rounded-xl p-1 text-xs">
          <Store className="w-3.5 h-3.5 text-slate-400 ml-2" />
          {competitors.map((comp) => (
            <button
              key={comp}
              onClick={() => onCompetitorChange(comp === 'Todas' ? '' : comp)}
              className={`px-2.5 py-1 rounded-lg transition-all font-medium cursor-pointer ${
                (selectedCompetitor === comp || (comp === 'Todas' && !selectedCompetitor))
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {comp}
            </button>
          ))}
        </div>

      </div>

    </div>
  );
};
