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
      dateFreeTrialEnds: dateFreeTrialEnds === '' ? null : dateFreeTrialEnds,
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
        <Grid item xs={12} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              py: 5,
              px: 5,
              my: 5,
              mx: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            component="form"
            noValidate
            onSubmit={handleSubmit}
          >
            <Typography
              variant="h1"
              color="primary"
              sx={{ textAlign: 'center' }}
              gutterBottom
            >
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
              // sx={{ mx: 4 }}
            >
              {name}
            </TextField>
            <TextField
              margin="normal"
              fullWidth
              name="website"
              label="Website"
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              // sx={{ mx: 2, xs: 4 }}
            >
              {website}
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
                sx={{ mt: 2 }}
              />
            </LocalizationProvider>
            <TextField
              id="freeTrial"
              select
              fullWidth
              label="Free Trial"
              value={freeTrial}
              //defaultValue={freeTrial ? freeTrial : false}
              onChange={handleFreeTrialChange}
              sx={{ mt: 2 }}
            >
              <MenuItem value={true as any}>Yes</MenuItem>
              <MenuItem value={false as any}>No</MenuItem>
            </TextField>
            {freeTrial && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date Free Trial Ends"
                  defaultValue={dayjs(dateFreeTrialEnds)}
                  value={dayjs(signupDate)}
                  onChange={(newValue) =>
                    handleDateChange(newValue?.toString())
                  }
                  sx={{ mt: 2 }}
                />
              </LocalizationProvider>
            )}

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
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'center',
                alignItems: 'center',
                mt: 5
              }}
            >
              <Button
                type="submit"
                variant="contained"
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
                Add New Subscription
              </Button>
              <Button
                type="button"
                variant="contained"
                onClick={() => navigate('/dashboard')}
                sx={{
                  width: '225px',
                  mt: 1,
                  mx: 2,
                  mb: 5,
                  py: 2,
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
