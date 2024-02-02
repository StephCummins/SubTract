import React from 'react';
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

const LoginForm = (): JSX.Element => {
  const navigate = useNavigate();
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
    <form>
      <GoogleOAuthProvider
        clientId={process.env.REACT_APP_GOOGLE_OUATH_CLIENT_ID!}
      >
        <GoogleLogin onSuccess={handleLogin} />
      </GoogleOAuthProvider>
    </form>
  );
};

export default LoginForm;
