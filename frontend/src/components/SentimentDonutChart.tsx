import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SentimentStats } from '../types';

interface SentimentDonutChartProps {
  stats?: SentimentStats;
}

export const SentimentDonutChart: React.FC<SentimentDonutChartProps> = ({ stats }) => {
  if (!stats || stats.total_reviews === 0) {
    return (
      <div className="glass-card rounded-2xl p-5 border border-slate-800/80 mb-6 text-center text-slate-500 text-xs">
        Sem avaliações processadas para a visualização de sentimentos.
      </div>
    );
  }

  const data = [
    { name: 'Positivo', value: stats.positive_count, color: '#10b981' },
    { name: 'Neutro', value: stats.neutral_count, color: '#6366f1' },
    { name: 'Negativo', value: stats.negative_count, color: '#f43f5e' },
  ];

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800/80 mb-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-white font-sans">
            Raio-X de Sentimento dos Clientes (NLP IA)
          </h3>
          <p className="text-xs text-slate-400">Distribuição do modelo HuggingFace BERT</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-emerald-400">
            {stats.positive_percentage}% Aprovados
          </span>
        </div>
      </div>

      <div className="h-56 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '12px',
                color: '#f8fafc',
                fontSize: '12px'
              }}
              formatter={(value: any, name: any) => [`${value} avaliações`, name]}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              formatter={(value) => <span className="text-xs text-slate-300 font-medium">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Total no centro da rosca */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-8 text-center pointer-events-none">
          <div className="text-xl font-bold text-white">{stats.total_reviews}</div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Reviews</div>
        </div>
      </div>
    </div>
  );
};
