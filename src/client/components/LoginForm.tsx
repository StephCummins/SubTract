import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import db from '../../server/database/db';

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
  const responseMessage = (response: any) => {
    const responseInfo = jwtDecode(response.credential);
    console.log(responseInfo);
    const user: UserProfile = {
      firstName: responseInfo.given_name,
      lastName: responseInfo.family_name,
      email: responseInfo.email,
      password: responseInfo.sub!,
      googleAuth: true,
      picture: responseInfo.picture,
    };
    console.log(user);

    const newUserData = `INSERT INTO users (first_name, last_name, email, password, google_auth, picture) VALUES($1, $2, $3, $4, $5 $6)`;

    const queryParams = [
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      user.googleAuth,
      user.picture,
    ];

    db.query(newUserData, queryParams);
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
