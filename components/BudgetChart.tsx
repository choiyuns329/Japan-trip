import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TripData } from '../types';

interface BudgetChartProps {
  data: TripData;
}

const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ec4899'];

export const BudgetChart: React.FC<BudgetChartProps> = ({ data }) => {
  const flightsCost = data.flights.reduce((acc, f) => acc + f.price, 0);
  const accomCost = data.accommodations.reduce((acc, a) => acc + a.price, 0);
  const activityCost = data.activities.reduce((acc, a) => acc + a.cost, 0);
  const transportCost = data.transportation.reduce((acc, t) => acc + t.cost, 0);
  
  const chartData = [
    { name: '항공', value: flightsCost },
    { name: '숙박', value: accomCost },
    { name: '활동', value: activityCost },
    { name: '교통', value: transportCost },
  ].filter(item => item.value > 0);

  const totalCost = flightsCost + accomCost + activityCost + transportCost;

  if (totalCost === 0) {
      return (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400 text-sm bg-white rounded-xl border border-gray-100">
              <p>아직 예산 데이터가 없습니다.</p>
              <p className="text-xs mt-1">일정을 추가하여 예상 비용을 확인하세요.</p>
          </div>
      );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-full flex flex-col">
      <h3 className="font-bold text-gray-800 text-lg mb-4">예산 분석</h3>
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
                formatter={(value: number) => `${value.toLocaleString()}원`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">총 예상 비용</span>
              <span className="text-xl font-bold text-gray-800">{totalCost.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between items-center mt-1 text-sm">
               <span className="text-gray-400">예산 설정</span>
               <span className={`${totalCost > data.budget ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
                   {data.budget.toLocaleString()}원
               </span>
          </div>
      </div>
    </div>
  );
};