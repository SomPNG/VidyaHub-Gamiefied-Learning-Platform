
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StudentData } from '../types';

interface ProgressChartProps {
  data: StudentData[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  const chartData = data.map(student => ({
    name: student.name,
    Coins: student.coins,
    Badges: student.badges.length,
  }));

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              borderColor: '#14b8a6',
              color: '#ffffff'
            }}
          />
          <Legend />
          <Bar dataKey="Coins" fill="#14b8a6" />
          <Bar dataKey="Badges" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;