import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

const TotalSpentPieChart = ({ pieChartData }): JSX.Element => {
  ChartJS.register(ArcElement, Tooltip, Legend);
  return <Doughnut data={pieChartData} />;
};

export default TotalSpentPieChart;
