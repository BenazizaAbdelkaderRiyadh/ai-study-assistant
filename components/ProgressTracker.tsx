import React from 'react';
import type { QuizResult } from '../types';

interface ProgressTrackerProps {
  history: QuizResult[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ history }) => {

  const Recharts = (window as any).Recharts;


  if (!Recharts) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg flex items-center justify-center" style={{ minHeight: '368px' }}>
        <p className="text-slate-500">Loading chart...</p>
      </div>
    );
  }

  const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

  const data = history.map((result, index) => ({
    name: `Attempt ${index + 1}`,
    score: (result.score / result.total) * 100,
  }));

  const lineColor = '#0891b2';
  const gridColor = '#e2e8f0';
  const textColor = '#475569';
  const tooltipBg = '#ffffff';
  const tooltipBorder = '#e2e8f0';
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
      <h2 className="text-xl font-semibold mb-4 text-slate-900">Quiz Progress</h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={textColor} />
            <YAxis unit="%" stroke={textColor} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                borderColor: tooltipBorder,
              }}
              labelStyle={{ color: textColor }}
            />
            <Legend wrapperStyle={{ color: textColor }} />
            <Line type="monotone" dataKey="score" stroke={lineColor} strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressTracker;