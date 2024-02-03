import React from 'react';
import LoginForm from './LoginForm';

const LoginPage = ({ user, setUser, signUp }): JSX.Element => {
  return (
    <div>
      <h1>Login Page!</h1>
      <LoginForm user={user} setUser={setUser} signUp={signUp} />
    </div>
  );
};

export default LoginPage;
