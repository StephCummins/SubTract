import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import theme from './MaterialUITheme';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import OrangeButton from './OrangeButton';
import PieChartTab from './PieChartTab';
import SubscriptionTable from './SubscriptionTable';
import ServerErrors from '../../server/models/ServerErrors';
import type Chart from '../models/ChartInterface';
import type Subscription from '../models/subscriptionInterface';

const DashboardPage = ({
  user,
  subs,
  setSubs,
  setCurrentSub,
  userNotAuthenticated,
  setShowMenu
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

  const navigate = useNavigate();

  const getSubscriptions = async () => {
    try {
      const response = await fetch(
        `/subs/retrieveallsubs?userId=${user.userId}`
      );

      if (!response.ok) throw response;

      const data = await response.json();

      if (data.message === ServerErrors.USER_NOT_AUTHENTICATED) {
        await userNotAuthenticated();
        navigate('/');
        return null;
      } else if (data.hasOwnProperty('formattedSubs')) {
        const updatedTotals = updateTotalSpent(data.formattedSubs);
        setSubs(updatedTotals);
        return updatedTotals;
      } else return [];
    } catch (error) {
      console.log('Error retrieving all user subscriptions', error);
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

  const updateTotalSpent = (subs: Subscription[]) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    subs.forEach((sub: Subscription) => {
      if (sub.autoCalc!) {
        let months = 0;
        const startDate = sub.freeTrial
          ? new Date(sub.dateFreeTrialEnds!)
          : new Date(sub.signupDate);
        months = (currentYear - startDate.getFullYear()) * 12;
        months -= startDate.getMonth();
        months += currentMonth;

        const totalSpent = sub.monthlyFee! * months;
        sub.totalSpent = totalSpent < 0 ? 0 : totalSpent;
      }
    });

    return subs;
  };

  const loadPage = async () => {
    const data = await getSubscriptions();

    if (data) {
      generatePieChartData(data, 'monthlyFee', setPieChartData);
      generatePieChartData(data, 'totalSpent', setTotalSpentData);
    }
  };

  useEffect(() => {
    setShowMenu(true);
    loadPage();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
            mt: 9,
            mb: { xs: 3, md: 5 }
          }}
        >
          <Grid item sx={{ mr: 10 }}>
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
          <Grid item sx={{ mt: { md: 2.5, xs: -2 } }}>
            <OrangeButton
              type={'button'}
              handleOnClick={() => navigate('/viewperformance')}
            >
              Budget Performance
            </OrangeButton>
          </Grid>
          <Grid item sx={{ mt: { md: 2.5, xs: -2 } }}>
            <OrangeButton
              type={'button'}
              handleOnClick={() => navigate('/budgettips')}
            >
              Budget Tips
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
              userNotAuthenticated={userNotAuthenticated}
            />
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default DashboardPage;
