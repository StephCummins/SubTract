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
import ServerErrors from '../../server/models/ServerErrors';

const updateSubPage = ({
  currentSub,
  setCurrentSub,
  user,
  setUser,
  setIsLoggedIn,
  updateTotalSpent
}): JSX.Element => {
  const [name, setName] = useState(currentSub.name);
  const [website, setWebsite] = useState(currentSub.website);
  const [signupDate, setSignupDate] = useState(
    String(currentSub.signupDate.slice(0, 10))
  );
  const [monthlyFee, setMonthlyFee] = useState(currentSub.monthlyFee);
  const [freeTrial, setFreeTrial] = useState(currentSub.freeTrial);
  const [dateFreeTrialEnds, setDateFreeTrialEnds] = useState(
    currentSub.dateFreeTrialEnds
  );
  const [autoCalc, setAutoCalc] = useState('');
  const [totalSpent, setTotalSpent] = useState(currentSub.totalSpent);

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

  const handleAutoCalc = (e) => {
    setAutoCalc(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSub = {
      subId: currentSub.subId,
      userId: currentSub.userId,
      name,
      website,
      signupDate,
      monthlyFee: parseInt(monthlyFee),
      freeTrial,
      dateFreeTrialEnds: dateFreeTrialEnds === '' ? null : dateFreeTrialEnds,
      totalSpent: parseInt(totalSpent),
      autoCalc
    };

    setCurrentSub(updatedSub);

    try {
      const response = await fetch('/subs/editsub', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSub)
      });

      if (!response.ok) throw response;

      const data = await response.json();
      console.log(data);

      if (data.message === ServerErrors.USER_NOT_AUTHENTICATED) {
        setIsLoggedIn(false);
        navigate('/');
      } else {
        setCurrentSub({
          subId: null,
          userId: null,
          name: '',
          website: '',
          signupDate: '',
          monthlyFee: null,
          freeTrial: false,
          dateFreeTrialEnds: '',
          totalSpent: null
        });

        navigate('/dashboard');
      }
    } catch (error) {
      console.log('Error updating subscription!', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MenuBar user={user} setUser={setUser} setIsLoggedIn={setIsLoggedIn} />
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
              Update Subscription
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
                  value={dayjs(dateFreeTrialEnds)}
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
            {/* <TextField
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
            </TextField> */}
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
                Update Subscription
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

export default updateSubPage;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import Grid from '@mui/material/Grid';
// import Paper from '@mui/material/Paper';
// import InputAdornment from '@mui/material/InputAdornment';
// import MenuItem from '@mui/material/MenuItem';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import dayjs from 'dayjs';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
// import MenuBar from './MenuBar';

// const UpdateSubPage = ({ currentSub, setCurrentSub, user }): JSX.Element => {
//   const [name, setName] = useState(currentSub.name);
//   const [website, setWebsite] = useState(currentSub.website);
//   const [signupDate, setSignupDate] = useState(
//     String(currentSub.signupDate.slice(0, 10))
//   );
//   const [monthlyFee, setMonthlyFee] = useState(currentSub.monthlyFee);
//   const [freeTrial, setFreeTrial] = useState(currentSub.freeTrial);
//   const [dateFreeTrialEnds, setDateFreeTrialEnds] = useState(
//     currentSub.dateFreeTrialEnds
//   );
//   const [totalSpent, setTotalSpent] = useState(currentSub.totalSpent);

//   const navigate = useNavigate();

//   const handleSignupDate = (newValue) => {
//     if (newValue) setSignupDate(newValue);
//   };

//   const handleDateChange = (newValue) => {
//     if (newValue) setDateFreeTrialEnds(newValue);
//   };

//   const handleFreeTrialChange = (e) => {
//     const bool = e.target.value;
//     console.log(bool);
//     setFreeTrial(bool);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const updatedSub = {
//       subId: currentSub.subId,
//       userId: currentSub.userId,
//       name,
//       website,
//       signupDate,
//       monthlyFee: parseInt(monthlyFee),
//       freeTrial,
//       dateFreeTrialEnds,
//       totalSpent: parseInt(totalSpent)
//     };

//     setCurrentSub(updatedSub);

//     try {
//       console.log('updatedSub:', updatedSub);
//       const response = await fetch('/subs/editsub', {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updatedSub)
//       });

//       if (!response.ok) throw response;

//       setCurrentSub({
//         subId: null,
//         userId: null,
//         name: '',
//         website: '',
//         signupDate: '',
//         monthlyFee: null,
//         freeTrial: false,
//         dateFreeTrialEnds: '',
//         totalSpent: null
//       });

//       navigate('/dashboard');
//     } catch (error) {
//       console.log('Error updating subscription!');
//     }
//   };

//   const defaultTheme = createTheme();
//   // console.log(signupDate);

//   return (
//     <ThemeProvider theme={defaultTheme}>
//       <MenuBar user={user} />
//       <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
//         <Box
//           sx={{
//             my: 8,
//             mx: 4,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center'
//           }}
//           component="form"
//           noValidate
//           onSubmit={handleSubmit}
//         >
//           <Typography component="h1" variant="h5">
//             Update Subscription
//           </Typography>
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             name="name"
//             label="Subscription Name"
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           >
//             {name}
//           </TextField>
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             name="monthlyFee"
//             label="Monthly Fee"
//             id="monthlyFee"
//             value={monthlyFee}
//             onChange={(e) => setMonthlyFee(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">$</InputAdornment>
//               )
//             }}
//           >
//             {monthlyFee}
//           </TextField>
//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <DatePicker
//               label="Signup Date"
//               defaultValue={dayjs(signupDate)}
//               value={dayjs(signupDate)}
//               onChange={(newValue) => handleSignupDate(newValue?.toString())}
//             />
//           </LocalizationProvider>
//           <TextField
//             id="freeTrial"
//             select
//             label="Free Trial"
//             value={freeTrial}
//             //defaultValue={freeTrial ? freeTrial : false}
//             onChange={handleFreeTrialChange}
//           >
//             <MenuItem value={true as any}>True</MenuItem>
//             <MenuItem value={false as any}>False</MenuItem>
//           </TextField>
//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <DatePicker
//               label="Date Free Trial Ends"
//               defaultValue={dayjs(dateFreeTrialEnds)}
//               value={dayjs(signupDate)}
//               onChange={(newValue) => handleDateChange(newValue?.toString())}
//             />
//           </LocalizationProvider>
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             name="website"
//             label="Website"
//             id="website"
//             value={website}
//             onChange={(e) => setWebsite(e.target.value)}
//           >
//             {website}
//           </TextField>
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             name="totalSpent"
//             label="Total Spent"
//             id="totalSpent"
//             value={totalSpent}
//             onChange={(e) => setTotalSpent(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">$</InputAdornment>
//               )
//             }}
//           >
//             {totalSpent}
//           </TextField>
//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{ mt: 3, mb: 2 }}
//           >
//             Update Subscription Info
//           </Button>
//         </Box>
//       </Grid>
//     </ThemeProvider>
//   );
// };

// export default UpdateSubPage;
