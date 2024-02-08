import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import theme from './MaterialUITheme';
import MenuBar from './MenuBar';
import OrangeButton from './OrangeButton';

const addNewSubPage = ({ user }): JSX.Element => {
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [signupDate, setSignupDate] = useState('');
  const [monthlyFee, setMonthlyFee] = useState('');
  const [freeTrial, setFreeTrial] = useState('');
  const [dateFreeTrialEnds, setDateFreeTrialEnds] = useState('');
  const [totalSpent, setTotalSpent] = useState('');

  const navigate = useNavigate();

  const handleSignupDate = (newValue) => {
    if (newValue) setSignupDate(newValue);
  };

  const handleDateChange = (newValue) => {
    if (newValue) setDateFreeTrialEnds(newValue);
  };

  const handleFreeTrialChange = (e) => {
    setFreeTrial(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newSub = {
      userId: user.userId,
      name,
      website,
      signupDate,
      monthlyFee: parseInt(monthlyFee),
      freeTrial,
      dateFreeTrialEnds:
        dateFreeTrialEnds === '' ? signupDate : dateFreeTrialEnds,
      totalSpent: parseInt(totalSpent)
    };

    try {
      console.log('newSub:', newSub);
      const response = await fetch('/subs/addsub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSub)
      });

      if (!response.ok) throw response;

      navigate('/dashboard');
    } catch (error) {
      console.log('Error adding new subscription!');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MenuBar user={user} />
      <Container>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              py: 3,
              px: 3,
              my: 8,
              mx: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            component="form"
            noValidate
            onSubmit={handleSubmit}
          >
            <Typography variant="h1" color="primary" gutterBottom>
              Create Subscription
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              name="name"
              label="Subscription Name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            >
              {name}
            </TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              name="monthlyFee"
              label="Monthly Fee"
              id="monthlyFee"
              value={monthlyFee}
              onChange={(e) => setMonthlyFee(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                )
              }}
            >
              {monthlyFee}
            </TextField>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Signup Date"
                defaultValue={dayjs(signupDate)}
                value={dayjs(signupDate)}
                onChange={(newValue) => handleSignupDate(newValue?.toString())}
              />
            </LocalizationProvider>
            <TextField
              id="freeTrial"
              select
              label="Free Trial"
              value={freeTrial}
              //defaultValue={freeTrial ? freeTrial : false}
              onChange={handleFreeTrialChange}
            >
              <MenuItem value={true as any}>True</MenuItem>
              <MenuItem value={false as any}>False</MenuItem>
            </TextField>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date Free Trial Ends"
                defaultValue={dayjs(dateFreeTrialEnds)}
                value={dayjs(signupDate)}
                onChange={(newValue) => handleDateChange(newValue?.toString())}
              />
            </LocalizationProvider>
            <TextField
              margin="normal"
              required
              fullWidth
              name="website"
              label="Website"
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            >
              {website}
            </TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              name="totalSpent"
              label="Total Spent"
              id="totalSpent"
              value={totalSpent}
              onChange={(e) => setTotalSpent(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                )
              }}
            >
              {totalSpent}
            </TextField>
            <Grid
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                mt: 5
              }}
            >
              <OrangeButton type={'submit'} handleOnClick={() => null}>
                Add New Subscription
              </OrangeButton>
              <Button
                type="button"
                variant="contained"
                onClick={() => navigate('/dashboard')}
                sx={{
                  width: '225px',
                  mb: 5,
                  bgcolor: 'primary.main',
                  '&:active': {
                    transform: 'translateY(4px)'
                  }
                }}
              >
                Cancel
              </Button>
            </Grid>
          </Box>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default addNewSubPage;
