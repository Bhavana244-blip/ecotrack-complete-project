import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../styles/Streaks.css';


export default function Streaks() {
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const fetchStreak = async () => {
      const uid = auth.currentUser.email;
      const q = query(collection(db, "carbon_logs"), where("user", "==", uid));
      const querySnapshot = await getDocs(q);

      const days = new Set();
      querySnapshot.forEach(doc => {
        const ts = doc.data().timestamp;
        const date = new Date(ts).toLocaleDateString();
        days.add(date);
      });

      // Convert Set to sorted array of dates
      const sorted = Array.from(days).sort(
        (a, b) => new Date(a) - new Date(b)
      );

      // Calculate streak
      let count = 0;
      let current = new Date();
      current.setHours(0, 0, 0, 0);

      while (days.has(current.toLocaleDateString())) {
        count++;
        current.setDate(current.getDate() - 1);
      }

      setStreak(count);

      // BADGES
      const earned = [];
      if (sorted.length >= 1) earned.push("🌱 First Log");
      if (sorted.length >= 5) earned.push("🚶 5 Logs Logged");
      if (count >= 3) earned.push("🔥 3-Day Streak");
      if (count >= 7) earned.push("👑 7-Day Streak Queen");
      if (sorted.length >= 10) earned.push("💚 Carbon Crusher");

      setBadges(earned);
    };

    fetchStreak();
  }, []);

  return (
  <div className="streaks-container">
    <h2>Your Eco Streak</h2>
    <p>You're on a <strong>{streak}</strong> day streak</p>

    <h3>🏅 Badges You've Earned</h3>
    <ul>
      {badges.length > 0 ? (
        badges.map((badge, i) => (
          <li key={i}>{badge}</li>
        ))
      ) : (
        <p className="empty">No badges earned yet. Start tracking your carbon footprint to unlock achievements and celebrate your progress.</p>
      )}
    </ul>
  </div>
);

}
