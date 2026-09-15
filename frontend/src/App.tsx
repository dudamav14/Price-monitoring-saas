import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { SearchFilterBar } from './components/SearchFilterBar';
import { ProductTable } from './components/ProductTable';
import { PriceHistoryChart } from './components/PriceHistoryChart';
import { SentimentDonutChart } from './components/SentimentDonutChart';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AddProductModal } from './components/AddProductModal';
import { Product, DashboardSummary } from './types';
import { fetchHealth, fetchProducts, fetchDashboardSummary } from './services/api';
import { AlertCircle, RefreshCcw, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [apiOnline, setApiOnline] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCompetitor, setSelectedCompetitor] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Verificação de saúde da API
      const health = await fetchHealth();
      setApiOnline(health.status === 'online');

      // 2. Carregar produtos
      const prodRes = await fetchProducts({
        search: searchTerm,
        categoryId: selectedCategory,
        competitorId: selectedCompetitor
      });
      setProducts(prodRes.data);

      // 3. Carregar resumo do Dashboard
      const dashRes = await fetchDashboardSummary();
      setDashboardData(dashRes.data);
    } catch (err) {
      console.error('Erro ao carregar dados do Dashboard:', err);
      setApiOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchTerm, selectedCategory, selectedCompetitor]);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 pb-16">
      
      {/* Top Header */}
      <Header apiOnline={apiOnline} onRefresh={loadData} onOpenAddModal={() => setIsAddModalOpen(true)} />

      {/* Container Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Banner de Boas-Vindas */}
        <div className="relative glass-card rounded-3xl p-6 sm:p-8 mb-8 border border-indigo-500/20 overflow-hidden shadow-glow-indigo">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Painel de Inteligência de Negócios & IA
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
                Monitoramento de E-Commerce & Sentimentos
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
                Acompanhamento em tempo real de flutuações de preços, catálogo de concorrentes e classificação de opiniões dos clientes via Inteligência Artificial (NLP Transformers).
              </p>
            </div>
            
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Atualizar Visão
            </button>
          </div>
        </div>

        {/* Alerta caso a API esteja offline */}
        {!apiOnline && !loading && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 flex items-center gap-3 text-rose-400 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-bold">Aviso de Conectividade:</span> Não foi possível comunicar com a API do Back-end Node.js na porta 3000. Certifique-se de que o servidor `npm run dev` esteja em execução.
            </div>
          </div>
        )}

        {/* Cards Executivos de KPI */}
        <KpiCards 
          kpis={dashboardData?.kpis} 
          sentimentStats={dashboardData?.sentiment_distribution} 
        />

        {/* Barra de Pesquisa e Filtros */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedCompetitor={selectedCompetitor}
          onCompetitorChange={setSelectedCompetitor}
        />

        {/* Tabela Principal de Produtos */}
        <ProductTable
          products={products}
          isLoading={loading}
          onSelectProduct={(product) => setSelectedProduct(product)}
        />

        {/* Seção Inferior: Visualizações e Gráficos do Mercado */}
        {dashboardData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PriceHistoryChart 
                data={products.length > 0 ? [{
                  id: '1',
                  price: products[0].current_price,
                  original_price: products[0].original_price,
                  discount_percentage: products[0].discount_percentage,
                  in_stock: true,
                  rating_score: '4.8',
                  rating_count: 100,
                  extracted_at: products[0].last_price_updated_at || new Date().toISOString()
                }] : []}
                productTitle="Variação Médian de Preços Monitorados"
              />
            </div>
            <div>
              <SentimentDonutChart stats={dashboardData.sentiment_distribution} />
            </div>
          </div>
        )}

      </main>

      {/* Modal de Detalhes do Produto */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Modal de Cadastro Manual de Produto */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          loadData();
        }}
      />

    </div>
  );
};

export default App;
