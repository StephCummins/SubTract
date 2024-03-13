import React from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

const BudgetChart = ({ totalMonthlySpend, budget }): JSX.Element => {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  const data = {
    labels: ['Target Monthly Budget', 'Current Monthly Budget'],
    datasets: [
      {
        data: [budget, totalMonthlySpend],
        backgroundColor: ['#2DD881', '#06BEE1']
      }
    ]
  };

  return <Bar options={options} data={data} />;
};

export default BudgetChart;
