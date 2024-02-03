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

const LoginForm = ({ user, setUser }): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginInfo = { email, password };
    console.log(loginInfo);

    try {
      const response = await fetch('/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginInfo)
      });

      if (!response.ok) throw response;

      const data = await response.json();

      await setUser(data);

      navigate('/dashboard');
    } catch (error) {
      console.log('Error logging in:', error);
    }

    // fetch('/user/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(loginInfo)
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log('data', data);
    //     setUser(data);
    //     console.log(user);
    //     navigate('/dashboard');
    //   })
    //   .catch((error) => {
    //     console.log('Error logging in:', error.message);
    //   });
  };

  const handleLogin = (response: any) => {
    const responseInfo = jwtDecode(response.credential);
    console.log(responseInfo);
    const user: UserProfile = {
      firstName: responseInfo.given_name,
      lastName: responseInfo.family_name,
      email: responseInfo.email,
      password: responseInfo.sub!,
      googleAuth: true,
      picture: responseInfo.picture
    };
    console.log(user);

    fetch('/user/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
      .then((res) => {
        console.log('In res!');
        if (res.ok) navigate('/dashboard');
      })
      .catch((error) => {
        console.log('Error logging in:', error.message);
      });
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
        <GoogleLogin onSuccess={handleLogin} />
      </GoogleOAuthProvider>
      <h2>Don't Have An Account?</h2>
      <button type="button">Sign Up!</button>
    </div>
  );
};

export default LoginForm;
