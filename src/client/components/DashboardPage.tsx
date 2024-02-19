import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { ThemeProvider } from '@mui/material/styles';
import theme from './MaterialUITheme';
import MenuBar from './MenuBar';
import SubscriptionTable from './SubscriptionTable';
import PieChart from './PieChart';
import type Subscription from '../models/subscriptionInterface';
import OrangeButton from './OrangeButton';
import PieChartTab from './PieChartTab';

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
  setCurrentSub,
  setIsLoggedIn
}): JSX.Element => {
  const [subs, setSubs] = useState([]);

  const [totalSpentData, setTotalSpentData] = useState<Chart>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: []
      }
    ]
  });

  const [pieChartData, setPieChartData] = useState<Chart>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: []
      }
    ]
  });

  const navigate = useNavigate();

  const getSubscriptions = async () => {
    try {
      const response = await fetch(
        `/subs/retrieveallsubs?userId=${user.userId}`
      );
      if (!response.ok) throw response;
      const data = await response.json();
      if (data[0]) setSubs(data);
      return data;
    } catch (error) {
      console.log('Error retrieving all user subscriptions');
    }
  };

  const generatePieChartData = (subInfo: Subscription[], title, func) => {
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
      const label = `${subscription.name} $${subscription[title]}`;
      updatedPieChart.labels.push(label);
      updatedPieChart.datasets[0].data.push(subscription[title]!);
    });

    func(updatedPieChart);
  };

  const loadPage = async () => {
    const data = await getSubscriptions();
    generatePieChartData(data, 'monthlyFee', setPieChartData);
    generatePieChartData(data, 'totalSpent', setTotalSpentData);
  };

  useEffect(() => {
    loadPage();
  }, []);

  const [value, setValue] = useState(0);

  const handleChange = (e, newValue) => {
    console.log(newValue);
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MenuBar user={user} setUser={setUser} setIsLoggedIn={setIsLoggedIn} />
      <Grid
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'start',
          alignItems: 'center',
          my: 5,
          mx: 5
        }}
      >
        <Typography
          variant="h1"
          color="primary"
          gutterBottom
          sx={{ mr: 7, mt: 2, mb: 5 }}
        >
          Subscription Dashboard
        </Typography>
        <OrangeButton type={'button'} handleOnClick={() => navigate('/add')}>
          Add New Subscription
        </OrangeButton>
      </Grid>
      <Grid
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row-reverse' },
          justifyContent: 'center',
          alignItems: 'start',
          my: 5,
          mx: 5
        }}
      >
        <PieChartTab
          pieChartData={pieChartData}
          totalSpentData={totalSpentData}
        />
        {/* <Grid
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Monthly Budget" />
            <Tab label="Total Budget" />
          </Tabs>

          {value === 0 && <PieChart pieChartData={pieChartData} />}

          {value === 1 && <PieChart pieChartData={totalSpentData} />}
        </Grid> */}

        {/* <TabPanel
          value={value}
          index={0}
          title={'Monthly Budget'}
          pieChartData={pieChartData}
        />
        <TabPanel
          value={value}
          index={1}
          title={'Total Budget'}
          pieChartData={totalSpentData}
        />

        <Grid item xs={12} md={4}>
          <Typography variant="h3" color="primary">
            Monthly Budget
          </Typography>
          <PieChart pieChartData={pieChartData} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h3" color="primary">
            Total Budget
          </Typography>
          <PieChart pieChartData={totalSpentData} />
        </Grid> */}

        <Grid item xs={12} md={8}>
          <SubscriptionTable
            setCurrentSub={setCurrentSub}
            subs={subs}
            setSubs={setSubs}
          />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default DashboardPage;
