import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import Grid from '@mui/material/Grid';
import type Chart from '../models/ChartInterface';
import type Subscription from '../models/subscriptionInterface';

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
  const [idealBudget, setIdealBudget] = useState(budget[0]);
  const [chartValues, setChartValues] = useState<Subscription[][]>([]);
  const [pieChartData, setPieChartData] = useState<Chart[]>([emptyPieChart]);

  useEffect(() => {
    const newBudget = checkPerformance();

    setPieChartData([]);
    const chartData = findOptimalCombinations(subs, newBudget);
    generatePieChartData(chartData);
  }, [budget]);

  const checkPerformance = () => {
    let newBudget: number = 0;
    if (performance === 'underBudget') {
      setIdealBudget(budget[0] - budget[0] * 0.2);
      newBudget = budget[0] - budget[0] * 0.2;
    } else {
      setIdealBudget(budget[0]);
      newBudget = budget[0];
    }
    return newBudget;
  };

  const findOptimalCombinations = (subs, idealBudget) => {
    const sorted = subs.sort((a, b) => a.monthlyFee - b.monthlyFee);
    const allCombos = findAllCombinations(sorted, idealBudget);
    const topCombos: Subscription[][] = allCombos.sort(
      (a, b) => b.length - a.length
    );
    setChartValues(topCombos.slice(0, 4));
    return topCombos.slice(0, 4);
  };

  const findAllCombinations = (values, budget, startIdx = 0) => {
    const result: Subscription[][] = [];

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
    <Grid
      container
      spacing={4}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'center',
        alignItems: 'center',
        mt: 2
      }}
    >
      {pieChartData.length === 0 && (
        <p
          style={{
            backgroundColor: '#e4e4e4',
            color: 'red',
            fontSize: 'medium',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          No Current Options With Your Current Subscriptions and Target Budget
        </p>
      )}
      {pieChartData.length > 0 &&
        pieChartData.map((obj, idx) => {
          const total = obj.datasets[0].data.reduce((a, b) => a + b, 0);
          return (
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                mx: 3
              }}
              key={idx}
            >
              <Doughnut key={idx} data={obj} />
              <p
                style={{
                  backgroundColor: '#e4e4e4',
                  color: 'green',
                  fontSize: 'medium',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
              >
                New Total: ${total}
                <br />${idealBudget - total} Under Budget
              </p>
            </Grid>
          );
        })}
    </Grid>
  );
};

export default CalcBudgetOptions;
