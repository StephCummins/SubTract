import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import theme from './MaterialUITheme';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import MenuBar from './MenuBar';
import BudgetChart from './BudgetChart';

const PerformancePage = ({
  subs,
  setSubs,
  user,
  setUser,
  setIsLoggedIn
}): JSX.Element => {
  const [totalMonthlySpend, setTotalMonthlySpend] = useState(0);
  const [budget, setBudget] = useState(100);
  const [fontColor, setFontColor] = useState<String>('green');
  const navigate = useNavigate();

  useEffect(() => {
    calculateTotalMonthlySpend();
    setFontColor(budget - totalMonthlySpend >= 0 ? 'green' : 'red');
  });

  const calculateTotalMonthlySpend = () => {
    console.log(subs);
    const total = subs.reduce(
      (accum, currentVal) => accum + currentVal.monthlyFee!,
      0
    );
    setTotalMonthlySpend(total);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MenuBar user={user} setUser={setUser} setIsLoggedIn={setIsLoggedIn} />
      <Container>
        <Grid item xs={12} md={6} component={Paper} elevation={6} square>
          <Box
            sx={{
              py: 5,
              px: 5,
              my: 5,
              mx: 5,
              mt: 15,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography
              variant="h1"
              color="primary"
              sx={{ textAlign: 'center' }}
              gutterBottom
            >
              Budget Performance
            </Typography>
            <Button
              type="button"
              variant="contained"
              onClick={() => navigate('/dashboard')}
              sx={{
                mt: 1,
                mb: 5,
                py: 2,
                mx: 2,
                width: '225px',
                bgcolor: 'secondary.main',
                '&:active': {
                  transform: 'translateY(4px)',
                  bgcolor: 'secondary.main'
                },
                '&:hover': {
                  bgcolor: 'secondary.dark'
                }
              }}
            >
              Return to Dashboard
            </Button>
            <Grid
              container
              spacing={2}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'center',
                alignItems: 'center',
                mt: 5
              }}
            >
              <Grid item xs={12} md={8}>
                <Typography
                  component="h2"
                  variant="h5"
                  color="primary"
                  sx={{ textAlign: 'center' }}
                  gutterBottom
                >
                  Target Budget vs. Current Budget
                </Typography>
                <BudgetChart
                  totalMonthlySpend={totalMonthlySpend}
                  budget={budget}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  component="h2"
                  variant="h5"
                  color="primary"
                  sx={{ textAlign: 'center' }}
                  gutterBottom
                >
                  Update Target Monthly Budget
                </Typography>
                <TextField
                  fullWidth
                  name="targetBudget"
                  label="Target Monthly Budget"
                  value={isNaN(budget) ? setBudget(0) : budget}
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    )
                  }}
                />
                {budget - totalMonthlySpend >= 0 && (
                  <p
                    style={{
                      backgroundColor: '#e4e4e4',
                      color: 'green',
                      fontSize: 'medium',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}
                  >
                    You are ${budget - totalMonthlySpend} under budget per
                    month!
                  </p>
                )}
                {totalMonthlySpend - budget > 0 && (
                  <p
                    style={{
                      backgroundColor: '#e4e4e4',
                      color: 'red',
                      fontSize: 'medium',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}
                  >
                    You are ${totalMonthlySpend - budget} over budget per month
                  </p>
                )}
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default PerformancePage;
