import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import theme from './MaterialUITheme';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import ServerErrors from '../../server/models/ServerErrors';

const addNewSubPage = ({
  user,
  userNotAuthenticated,
  updateTotalSpent,
  setShowMenu
}): JSX.Element => {
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [signupDate, setSignupDate] = useState('');
  const [monthlyFee, setMonthlyFee] = useState('');
  const [freeTrial, setFreeTrial] = useState('');
  const [dateFreeTrialEnds, setDateFreeTrialEnds] = useState('');
  const [autoCalc, setAutoCalc] = useState('');
  const [totalSpent, setTotalSpent] = useState('');
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setShowMenu(true);
  }, []);

  const handleSignupDate = (newValue) => {
    if (newValue) setSignupDate(newValue);
  };

  const handleDateChange = (newValue) => {
    if (newValue) setDateFreeTrialEnds(newValue);
  };

  const handleFreeTrialChange = (e) => {
    setFreeTrial(e.target.value);
  };

  const handleAutoCalc = (e) => {
    setAutoCalc(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    if (!name || !signupDate || !monthlyFee) {
      setError(true);
      return;
    }
    console.log(signupDate);
    const newSub = {
      userId: user.userId,
      name,
      website,
      signupDate,
      monthlyFee: parseInt(monthlyFee),
      freeTrial: freeTrial === '' ? false : freeTrial,
      dateFreeTrialEnds: dateFreeTrialEnds === '' ? null : dateFreeTrialEnds,
      totalSpent: totalSpent === '' ? 0 : parseInt(totalSpent),
      autoCalc: autoCalc === '' ? false : autoCalc
    };

    try {
      const response = await fetch('/subs/addsub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSub)
      });

      if (!response.ok) throw response;

      const data = await response.json();

      if (data.message === ServerErrors.USER_NOT_AUTHENTICATED) {
        await userNotAuthenticated();
        navigate('/');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.log('Error adding new subscription!', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Grid item xs={12} md={5} component={Paper} elevation={6} square>
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
              id="automaticallycalctotal"
              select
              fullWidth
              label="Automatically Calculate Total Spent?"
              value={autoCalc}
              onChange={handleAutoCalc}
              sx={{ mt: 2 }}
            >
              <MenuItem value={true as any}>Yes</MenuItem>
              <MenuItem value={false as any}>No</MenuItem>
            </TextField>
            {!autoCalc && (
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
            )}
            {autoCalc && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="totalSpent"
                label="Total Spent"
                id="totalSpent"
                value={updateTotalSpent({
                  signupDate,
                  freeTrial,
                  dateFreeTrialEnds,
                  monthlyFee
                })}
                onChange={(e) => setTotalSpent(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  )
                }}
              >
                {totalSpent}
              </TextField>
            )}
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
            {error && (
              <Grid item sx={{ alignItems: 'left' }}>
                <Typography sx={{ color: 'red' }}>
                  <strong>Please Fill Out All Required Fields</strong>
                </Typography>
              </Grid>
            )}
          </Box>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default addNewSubPage;
