import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/Leaderboard.css';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const snapshot = await getDocs(collection(db, "carbon_logs"));
      const userTotals = {};

      snapshot.forEach(doc => {
        const { user, carbon_footprint } = doc.data();
        if (!user) return;

        if (!userTotals[user]) userTotals[user] = 0;
        userTotals[user] += carbon_footprint;
      });

      const leaderboard = Object.entries(userTotals)
        .map(([email, total]) => ({
          email,
          total: Math.round(total * 100) / 100
        }))
        .sort((a, b) => a.total - b.total); // lower carbon = better

      setLeaders(leaderboard);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-container">
      <h2>🌍 Global Eco Leaderboard</h2>
      <p>See who’s leading the way in making a positive impact on our planet.</p>

      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Total CO₂ (kg)</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((u, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{u.email}</td>
              <td>{u.total}</td>
              <td>{getTitle(i)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getTitle(rank) {
  if (rank === 0) return '👑 Eco Champion';
  if (rank === 1) return '🔥 Runner-Up Hero';
  if (rank === 2) return '💚 Green Advocate';
  return '🌿 Earth Protector';
}
