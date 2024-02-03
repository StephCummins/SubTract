import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import type User from './models/userInterface';

const App = (): JSX.Element => {
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

  const navigate = useNavigate();

  const handleSetUser = (updatedUser: {}) => {
    console.log('Invoked handleSetUser');
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
          break;
      }
    }
    console.log('User Copy!', userCopy);

    setUser(userCopy);
  };

  const handleSignup = async (signupInfo) => {
    try {
      const response = await fetch('/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupInfo)
      });

      if (!response.ok) throw response;

      const data = await response.json();
      console.log('data', data);

      await setUser(data);

      console.log('Successfully created account!');
      navigate('/dashboard');
    } catch (error) {
      console.log('Error signing up for account:', error);
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LoginPage
            user={user}
            setUser={handleSetUser}
            signUp={handleSignup}
          />
        }
      />
      <Route
        path="/signup"
        element={
          <SignupPage
            user={user}
            setUser={handleSetUser}
            signUp={handleSignup}
          />
        }
      />
      <Route
        path="/dashboard"
        element={<DashboardPage user={user} setUser={setUser} />}
      />
    </Routes>
  );
};

export default App;
