import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import MenuBar from './MenuBar';
import SubscriptionTable from './SubscriptionTable';
import PieChart from './PieChart';
import type Subscription from '../models/subscriptionInterface';

interface Datasets {
  data: number[];
  backgroundColor: string[];
}

interface Chart {
  labels: string[];
  datasets: Datasets[];
}

const DashboardPage = ({
  user,
  setUser,
  currentSub,
  setCurrentSub
}): JSX.Element => {
  const [subs, setSubs] = useState([]);
  const [pieChartData, setPieChartData] = useState<Chart>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#2d00f7', '#8900f2', '#d100d1', '#f20089']
      }
    ]
  });

  const getSubscriptions = async () => {
    try {
      const response = await fetch(
        `/subs/retrieveallsubs?userId=${user.userId}`
      );
      if (!response.ok) throw response;
      const data = await response.json();
      if (data[0]) setSubs(data);
      console.log('GOT ALL SUBS!!!');
      return data;
    } catch (error) {
      console.log('Error retrieving all user subscriptions');
    }
  };

  const generatePieChartData = (subInfo: Subscription[]) => {
    const updatedPieChart: Chart = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: ['#2d00f7', '#8900f2', '#d100d1', '#f20089']
        }
      ]
    };

    subInfo.forEach((subscription: Subscription) => {
      const label = `${subscription.name} $${subscription.monthlyFee}`;
      updatedPieChart.labels.push(label);
      updatedPieChart.datasets[0].data.push(subscription.monthlyFee!);
    });

    setPieChartData(updatedPieChart);
  };

  const loadPage = async () => {
    const data = await getSubscriptions();
    generatePieChartData(data);
  };

  useEffect(() => {
    loadPage();
  }, []);

  return (
    <main>
      <MenuBar user={user} />
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <SubscriptionTable
            user={user}
            setUser={setUser}
            currentSub={currentSub}
            setCurrentSub={setCurrentSub}
            getSubscriptions={getSubscriptions}
            subs={subs}
            setSubs={setSubs}
          />
        </Grid>
        <Grid item xs={4}>
          <PieChart pieChartData={pieChartData} />
        </Grid>
      </Grid>
    </main>
  );
};

export default DashboardPage;
