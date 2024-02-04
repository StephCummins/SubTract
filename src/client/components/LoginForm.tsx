import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

declare module 'jwt-decode' {
  export interface JwtPayload {
    given_name: string;
    family_name: string;
    email: string;
    picture: string;
  }
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  googleAuth: true;
  picture?: string;
  dateCreated?: string;
}

const LoginForm = ({ user, setUser, signUp }): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const login = async (loginInfo) => {
    try {
      const response = await fetch('/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo)
      });

      if (!response.ok) throw response;

      const data = await response.json();

      await setUser(data);
      console.log('Successfully logged in!');
      navigate('/dashboard');
    } catch (error) {
      console.log('Error logging in:', error);
    }
  };

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  const handleGoogleLogin = async (response: any) => {
    const responseInfo = jwtDecode(response.credential);

    const user: UserProfile = {
      firstName: responseInfo.given_name,
      lastName: responseInfo.family_name,
      email: responseInfo.email,
      password: responseInfo.sub!,
      googleAuth: true,
      picture: responseInfo.picture
    };

    try {
      const response = await fetch(`/user/checkforaccount?email=${user.email}`);
      if (!response.ok) throw response;
      const data = await response.json();
      if (data[0]) login(user);
      else signUp(user);
    } catch (error) {
      console.log('Error logging in with Google Oauth', error);
    }
  };

  return (
    <div>
      <h1>SubTract</h1>
      <form onSubmit={handleFormLogin}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <hr />
      <GoogleOAuthProvider
        clientId={process.env.REACT_APP_GOOGLE_OUATH_CLIENT_ID!}
      >
        <GoogleLogin onSuccess={handleGoogleLogin} />
      </GoogleOAuthProvider>
      <h2>Don't Have An Account?</h2>
      <button type="button" onClick={() => navigate('/signup')}>
        Sign Up!
      </button>
    </div>
  );
};

export default LoginForm;
