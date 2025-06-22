import React from 'react';
import Home from './pages/Home';

export default function Dashboard({ user, onLogout }) {
  return (
    <div>
      <h1>Welcome, {user} </h1>
      <button onClick={onLogout}>Logout </button>
      <Home />
    </div>
  );
}
