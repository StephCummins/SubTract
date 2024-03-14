import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Grid from '@mui/material/Grid';

interface Datasets {
  data: number[];
  backgroundColor: string[];
}

interface Chart {
  labels: string[];
  datasets: Datasets[];
}

const CalcBudgetOptions = ({ subs, budget, performance }): JSX.Element => {
  const emptyPieChart: Chart = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#05299E', '#06BEE1', '#FF7409', '#2DD881']
      }
    ]
  };
  const [idealBudget, setIdealBudget] = useState(budget);
  const [chartValues, setChartValues] = useState([]);
  const [pieChartData, setPieChartData] = useState<Chart[]>([emptyPieChart]);

  useEffect(() => {
    checkPerformance();
    if (subs.length > 1) {
      const chartData = findOptimalCombinations(subs, idealBudget);
      generatePieChartData(chartData);
    }
  }, []);

  const checkPerformance = () => {
    if (performance === 'underBudget') {
      setIdealBudget(budget - budget * 0.2);
    }
  };

  const findOptimalCombinations = (subs, idealBudget) => {
    const sorted = subs.sort((a, b) => a.monthlyFee - b.monthlyFee);
    const allCombos = findAllCombinations(sorted, idealBudget);
    const topCombos = allCombos.sort((a, b) => b.length - a.length);
    console.log(topCombos.slice(0, 4));
    setChartValues(topCombos.slice(0, 4));
    return topCombos.slice(0, 4);
  };

  const findAllCombinations = (values, budget, startIdx = 0) => {
    const result = [];

    for (let idx = startIdx; idx < values.length; idx++) {
      if (values[idx].monthlyFee > budget) break;
      const combos = findAllCombinations(
        values,
        budget - values[idx].monthlyFee,
        idx + 1
      );
      if (combos.length > 0) {
        for (let idx2 = 0; idx2 < combos.length; idx2++) {
          result.push([...combos[idx2], values[idx]]);
        }
      } else {
        result.push([values[idx]]);
      }
    }

    return result;
  };

  const generatePieChartData = (chartData) => {
    chartData.forEach((value) => {
      console.log(value);
      const updatedPieChart: Chart = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: ['#05299E', '#06BEE1', '#FF7409', '#2DD881']
          }
        ]
      };

      value.forEach((subscription) => {
        const label = `${subscription.name} $${subscription.monthlyFee}`;
        updatedPieChart.labels.push(label);
        updatedPieChart.datasets[0].data.push(subscription.monthlyFee);
      });

      setPieChartData((pieChartData) => [...pieChartData, updatedPieChart]);
    });
  };

  return (
    <Grid item xs={12} md={6}>
      {pieChartData.map((obj, idx) => (
        <Doughnut key={idx} data={obj} />
      ))}
    </Grid>
  );
};

export default CalcBudgetOptions;
