import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = ({ user, setUser, signUp }): JSX.Element => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const accountInfo = {
      firstName,
      lastName,
      email,
      password,
      googleAuth: false
    };
    console.log('accountInfo', accountInfo);

    signUp(accountInfo);
    // try {
    //   const response = await fetch('/user/signup', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(accountInfo)
    //   });

    //   if (!response.ok) throw response;

    //   const data = await response.json();
    //   console.log('data', data);

    //   await setUser(data);

    //   console.log('user', user);
    //   navigate('/dashboard');
    // } catch (error) {
    //   console.log('Error creating account:', error);
    // }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <h1>Create Account</h1>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
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
      <button type="submit">Sign Up!</button>
    </form>
  );
};

export default SignupPage;
