import React from 'react';
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
  picture?: string;
}

const LoginForm = (): JSX.Element => {
  const responseMessage = (response: any) => {
    const responseInfo = jwtDecode(response.credential);
    console.log(responseInfo);
    const user: UserProfile = {
      firstName: responseInfo.given_name,
      lastName: responseInfo.family_name,
      email: responseInfo.email,
      picture: responseInfo.picture,
    };
    console.log(user);
  };

  return (
    <form>
      <GoogleOAuthProvider
        clientId={process.env.REACT_APP_GOOGLE_OUATH_CLIENT_ID!}
      >
        <GoogleLogin onSuccess={responseMessage} />
      </GoogleOAuthProvider>
    </form>
  );
};

export default LoginForm;
