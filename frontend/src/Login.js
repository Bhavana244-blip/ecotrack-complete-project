import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import './styles/Login.css';


export default function Login({ onLogin, onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      onLogin(userCred.user.email);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
  <form className="login-form" onSubmit={handleSubmit}>
    <h2>Login to your <b>EcoTrack</b> Account</h2>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={e => setEmail(e.target.value)}
      required
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={e => setPassword(e.target.value)}
      required
    />
    <button type="submit">Login</button>
    <p>
      Don’t have an account?{" "}
      <span onClick={onSwitch}>Sign up</span>
    </p>
  </form>
);

}
