import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { PriceHistoryPoint } from '../types';

interface PriceHistoryChartProps {
  data: PriceHistoryPoint[];
  productTitle?: string;
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ data, productTitle }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs">
        Sem pontos de histórico de preço suficientes para renderizar a tendência temporal.
      </div>
    );
  }

  // Formatar dados para o Recharts
  const chartData = data.map((item) => {
    const date = new Date(item.extracted_at);
    return {
      dateFormatted: `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')} ${date.getHours()}:00`,
      Preço: parseFloat(item.price),
      Original: item.original_price ? parseFloat(item.original_price) : parseFloat(item.price),
      Desconto: parseFloat(item.discount_percentage || '0')
    };
  });

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800/80 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white font-sans">
            Evolução Temporal de Preços (Série Temporal)
          </h3>
          {productTitle && (
            <p className="text-xs text-slate-400 line-clamp-1">{productTitle}</p>
          )}
        </div>
        <span className="text-[11px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-medium">
          Cotações Diárias
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis 
              dataKey="dateFormatted" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false}
              tickFormatter={(val) => `R$${val}`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '12px',
                color: '#f8fafc',
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
              }}
              formatter={(value: any) => [`R$ ${Number(value).toFixed(2)}`, 'Preço Atual']}
            />
            <Area 
              type="monotone" 
              dataKey="Preço" 
              stroke="#6366f1" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#priceGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
