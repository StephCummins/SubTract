import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import UpdateSubPage from './UpdateSubPage';
import AddNewSubPage from './AddNewSubPage';
import AccountPage from './AccountPage';
import DeleteAccountPage from './DeleteAccountPage';
import UserErrors from '../models/UserErrors';
import type User from '../models/userInterface';
import type Subscription from '../models/subscriptionInterface';

const App = (): JSX.Element => {
  const [userError, setUserError] = useState(UserErrors.NONE);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [user, setUser] = useState<User>({
    userId: null,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    googleAuth: null,
    picture: null,
    dateCreated: null
  });

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

  const [duplicateUser, setDuplicateUser] = useState(false);

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
      setIsLoggedIn(true);
      navigate('/dashboard');
    } catch (error) {
      setUserError(UserErrors.DUPLICATE_USER);
      console.log('Error signing up for account:', error);
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LoginPage
            setUser={handleSetUser}
            signUp={handleSignup}
            setIsLoggedIn={setIsLoggedIn}
            userError={userError}
            setUserError={setUserError}
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
          />
        }
      />
      <Route
        path="/dashboard"
        element={
          <DashboardPage
            user={user}
            setUser={setUser}
            setCurrentSub={setCurrentSub}
            setIsLoggedIn={setIsLoggedIn}
          />
        }
      />
      <Route
        path="/update"
        element={
          <UpdateSubPage
            currentSub={currentSub}
            setCurrentSub={setCurrentSub}
            user={user}
            setUser={setUser}
            setIsLoggedIn={setIsLoggedIn}
          />
        }
      />
      <Route
        path="/add"
        element={
          <AddNewSubPage
            user={user}
            setUser={setUser}
            setIsLoggedIn={setIsLoggedIn}
          />
        }
      />
      <Route
        path="/account"
        element={
          <AccountPage
            user={user}
            setUser={handleSetUser}
            setIsLoggedIn={setIsLoggedIn}
            userError={userError}
            setUserError={setUserError}
          />
        }
      />
      <Route
        path="/deleteaccount"
        element={
          <DeleteAccountPage
            user={user}
            setUser={setUser}
            setIsLoggedIn={setIsLoggedIn}
          />
        }
      />
    </Routes>
  );
};

export default App;
