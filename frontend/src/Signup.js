import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import './styles/Signup.css';


export default function Signup({ onSignup, onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      onSignup(userCred.user.email);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
  <form className="signup-form" onSubmit={handleSubmit}>
    <h2>Create your <b>EcoTrack</b> Account</h2>
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
    <button type="submit">Create Account</button>
    <p>
      Already have an account?{" "}
      <span onClick={onSwitch}>Login here</span>
    </p>
  </form>
);

}
