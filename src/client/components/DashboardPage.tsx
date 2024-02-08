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
        backgroundColor: []
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
          backgroundColor: ['#05299E', '#06BEE1', '#FF7409', '#2DD881']
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
      <Grid
        container
        // spacing={2}
        sx={{
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
          alignItems: 'start',
          my: 5,
          mx: 5
        }}
      >
        <Grid item xs={12} md={8}>
          <SubscriptionTable
            setCurrentSub={setCurrentSub}
            subs={subs}
            setSubs={setSubs}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <PieChart pieChartData={pieChartData} />
        </Grid>
      </Grid>
    </main>
  );
};

export default DashboardPage;
