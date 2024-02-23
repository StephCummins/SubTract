import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './MaterialUITheme';
import MenuBar from './MenuBar';
import SubscriptionTable from './SubscriptionTable';
import type Subscription from '../models/subscriptionInterface';
import OrangeButton from './OrangeButton';
import PieChartTab from './PieChartTab';
import ServerErrors from '../../server/models/serverErrors';

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
  setCurrentSub,
  setIsLoggedIn
}): JSX.Element => {
  const emptyPieChart: Chart = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#05299E', '#06BEE1', '#FF7409', '#2DD881']
      }
    ]
  };

  const [totalSpentData, setTotalSpentData] = useState<Chart>(emptyPieChart);
  const [pieChartData, setPieChartData] = useState<Chart>(emptyPieChart);
  const [subs, setSubs] = useState([]);

  const navigate = useNavigate();

  const getSubscriptions = async () => {
    try {
      const response = await fetch(
        `/subs/retrieveallsubs?userId=${user.userId}`
      );

      if (!response.ok) throw response;

      const data = await response.json();

      if (data.message === ServerErrors.USER_NOT_AUTHENTICATED) {
        navigate('/');
        return null;
      } else if (data.hasOwnProperty('formattedSubs')) {
        setSubs(data.formattedSubs);
        return data.formattedSubs;
      } else return [];
    } catch (error) {
      console.log('Error retrieving all user subscriptions');
    }
  };

  const generatePieChartData = (
    subInfo: Subscription[],
    title: string,
    func
  ) => {
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

    if (!data) {
      setIsLoggedIn(false);
    } else {
      generatePieChartData(data, 'monthlyFee', setPieChartData);
      generatePieChartData(data, 'totalSpent', setTotalSpentData);
    }
  };

  useEffect(() => {
    loadPage();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MenuBar user={user} setUser={setUser} setIsLoggedIn={setIsLoggedIn} />
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid
          container
          spacing={4}
          sx={{
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: { xs: 'center' },
            alignItems: 'center',
            mt: 1,
            mb: { xs: 2, md: 4 }
          }}
        >
          <Grid item>
            <Typography variant="h1" color="primary">
              Subscription Dashboard
            </Typography>
          </Grid>
          <Grid item sx={{ mt: { md: 2.5, xs: -2 } }}>
            <OrangeButton
              type={'button'}
              handleOnClick={() => navigate('/add')}
            >
              Add New Subscription
            </OrangeButton>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={5}
          sx={{
            flexDirection: { xs: 'column', md: 'row-reverse' },
            justifyContent: 'center',
            alignItems: { xs: 'center', md: 'start' }
          }}
        >
          <Grid item>
            <PieChartTab
              pieChartData={pieChartData}
              totalSpentData={totalSpentData}
            />
          </Grid>
          <Grid item>
            <SubscriptionTable
              setCurrentSub={setCurrentSub}
              subs={subs}
              loadPage={loadPage}
            />
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );

  // return (
  //   <ThemeProvider theme={theme}>
  //     <CssBaseline />
  //     <MenuBar user={user} setUser={setUser} setIsLoggedIn={setIsLoggedIn} />
  //     <Grid
  //       sx={{
  //         display: 'flex',
  //         flexDirection: { xs: 'column', md: 'row' },
  //         justifyContent: 'start',
  //         alignItems: 'center',
  //         my: 5,
  //         mx: 5
  //       }}
  //     >
  //       <Typography
  //         variant="h1"
  //         color="primary"
  //         gutterBottom
  //         sx={{ mr: 7, mt: 2, mb: 5 }}
  //       >
  //         Subscription Dashboard
  //       </Typography>
  //       <OrangeButton type={'button'} handleOnClick={() => navigate('/add')}>
  //         Add New Subscription
  //       </OrangeButton>
  //     </Grid>
  //     <Grid
  //       sx={{
  //         display: 'flex',
  //         flexDirection: { xs: 'column', md: 'row-reverse' },
  //         justifyContent: 'center',
  //         alignItems: 'start',
  //         my: 5,
  //         mx: 5
  //       }}
  //     >
  //       <PieChartTab
  //         pieChartData={pieChartData}
  //         totalSpentData={totalSpentData}
  //       />
  //       <Grid item xs={12} md={8}>
  //         <SubscriptionTable
  //           setCurrentSub={setCurrentSub}
  //           subs={subs}
  //           setSubs={setSubs}
  //         />
  //       </Grid>
  //     </Grid>
  //   </ThemeProvider>
  // );
};

export default DashboardPage;
