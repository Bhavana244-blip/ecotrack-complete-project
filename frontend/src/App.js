import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import Home from './pages/Home';
import Stats from './pages/Stats';
import Streaks from './pages/Streaks';
import Leaderboard from './pages/Leaderboard';
import ARView from './pages/ARView';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

export default function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthChecked(true);
    });
    return () => unsub();
  }, []);

  if (!authChecked) {
    return <p style={{ textAlign: 'center', marginTop: '3rem' }}><b>Loading your page...</b></p>;
  }

  if (!user) {
    return showSignup ? (
      <Signup 
        onSignup={(email) => {
          setUser({ email });
          setShowSignup(false);
        }} 
        onSwitch={() => setShowSignup(false)} 
      />
    ) : (
      <Login 
        onLogin={(email) => {
          setUser({ email });
        }} 
        onSwitch={() => setShowSignup(true)} 
      />
    );
  }

  return (
    <Router>
      <Navbar />
      {/* Wrap routes in a div with bottom padding to avoid navbar overlap */}
      <div style={{ paddingBottom: '70px', minHeight: '100vh', boxSizing: 'border-box' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/streaks" element={<Streaks />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/ar" element={<ARView />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}
