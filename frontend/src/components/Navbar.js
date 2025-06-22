import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import './Navbar.css';

export default function Navbar() {
  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/stats">Stats</Link>
      <Link to="/streaks">Streaks</Link>
      <Link to="/leaderboard">Leaderboard</Link>
      <Link to="/ar">AR</Link>
      <Link to="/profile">Profile</Link>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </nav>
  );
}
