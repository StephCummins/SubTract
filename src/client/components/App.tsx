import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AddNewSubPage from './AddNewSubPage';
import AccountPage from './AccountPage';
import UpdateAvatarPage from './UpdateAvatarPage';
import DashboardPage from './DashboardPage';
import DeleteAccountPage from './DeleteAccountPage';
import LoginPage from './LoginPage';
import MenuBar from './MenuBar';
import PerformancePage from './PerformancePage';
import SignupPage from './SignupPage';
import UpdateSubPage from './UpdateSubPage';
import UserErrors from '../models/UserErrors';
import type Subscription from '../models/subscriptionInterface';
import type User from '../models/userInterface';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './MaterialUITheme';

const App = (): JSX.Element => {
  const emptyUserInfo: User = {
    userId: null,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    googleAuth: null,
    picture: null,
    dateCreated: null
  };

  const [showMenu, setShowMenu] = useState(true);
  const [subs, setSubs] = useState([]);
  const [userError, setUserError] = useState(UserErrors.NONE);
  const [user, setUser] = useState<User>(emptyUserInfo);
  const [currentSub, setCurrentSub] = useState<Subscription>({
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

  const userNotAuthenticated = () => {
    setSubs([]);
    setUser(emptyUserInfo);
  };

  const navigate = useNavigate();

  const handleSetUser = (updatedUser: {}) => {
    const userCopy = { ...user };

    for (let key in updatedUser) {
      switch (key) {
        case 'user_id':
          userCopy.userId = updatedUser[key];
          break;
        case 'first_name':
          userCopy.firstName = updatedUser[key];
          break;
        case 'last_name':
          userCopy.lastName = updatedUser[key];
          break;
        case 'email':
          userCopy.email = updatedUser[key];
          break;
        case 'password':
          userCopy.password = updatedUser[key];
          break;
        case 'google_auth':
          userCopy.googleAuth = updatedUser[key];
          break;
        case 'picture':
          userCopy.picture = updatedUser[key];
          break;
        case 'date_created':
          userCopy.dateCreated = updatedUser[key];
      }
    }

    setUser(userCopy);
  };

  const handleSignup = async (signupInfo: User) => {
    setUserError(UserErrors.NONE);
    try {
      const response = await fetch('/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupInfo)
      });

      if (!response.ok) throw response;

      const data = await response.json();

      handleSetUser(data);
      navigate('/dashboard');
    } catch (error) {
      setUserError(UserErrors.DUPLICATE_USER);
      console.log('Error signing up for account:', error);
    }
  };

  const updateTotalSpent = (sub: Subscription) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    let months = 0;
    const startDate = sub.freeTrial
      ? new Date(sub.dateFreeTrialEnds!)
      : new Date(sub.signupDate);
    months = (currentYear - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += currentMonth;

    const totalSpent = sub.monthlyFee! * months;

    return isNaN(totalSpent) || totalSpent < 0 ? 0 : totalSpent;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {showMenu && (
        <MenuBar user={user} userNotAuthenticated={userNotAuthenticated} />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <LoginPage
              setUser={handleSetUser}
              signUp={handleSignup}
              userError={userError}
              setUserError={setUserError}
              userNotAuthenticated={userNotAuthenticated}
              setShowMenu={setShowMenu}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <SignupPage
              signUp={handleSignup}
              userError={userError}
              setUserError={setUserError}
              setShowMenu={setShowMenu}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <DashboardPage
              subs={subs}
              setSubs={setSubs}
              user={user}
              setCurrentSub={setCurrentSub}
              userNotAuthenticated={userNotAuthenticated}
              setShowMenu={setShowMenu}
            />
          }
        />
        <Route
          path="/update"
          element={
            <UpdateSubPage
              currentSub={currentSub}
              setCurrentSub={setCurrentSub}
              userNotAuthenticated={userNotAuthenticated}
              updateTotalSpent={updateTotalSpent}
              setShowMenu={setShowMenu}
            />
          }
        />
        <Route
          path="/add"
          element={
            <AddNewSubPage
              user={user}
              userNotAuthenticated={userNotAuthenticated}
              updateTotalSpent={updateTotalSpent}
              setShowMenu={setShowMenu}
            />
          }
        />
        <Route
          path="/viewperformance"
          element={<PerformancePage subs={subs} setShowMenu={setShowMenu} />}
        />
        <Route
          path="/account"
          element={
            <AccountPage
              user={user}
              setUser={handleSetUser}
              userError={userError}
              setUserError={setUserError}
              setShowMenu={setShowMenu}
            />
          }
        />
        <Route
          path="/updateavatar"
          element={
            <UpdateAvatarPage
              user={user}
              setUser={handleSetUser}
              setShowMenu={setShowMenu}
            />
          }
        />
        <Route
          path="/delete"
          element={
            <DeleteAccountPage
              user={user}
              subs={subs}
              setSubs={setSubs}
              setShowMenu={setShowMenu}
              userNotAuthenticated={userNotAuthenticated}
            />
          }
        />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
