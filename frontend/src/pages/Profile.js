import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import '../styles/Profile.css';

export default function Profile() {
  const user = auth.currentUser;
  const [travel, setTravel] = useState("car");
  const [saveMsg, setSaveMsg] = useState('');
  const [logs, setLogs] = useState([]);

  // Fetch profile and logs on mount
  useEffect(() => {
    const fetchProfileAndLogs = async () => {
      if (!user?.email) return;

      // Fetch travel preference
      const docRef = doc(db, "user_profiles", user.email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTravel(docSnap.data().travel_mode);
      }

      // Fetch carbon logs
      const snapshot = await getDocs(collection(db, "carbon_logs"));
      const userLogs = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.user === user.email) {
          userLogs.push(data);
        }
      });

      // Sort by timestamp (latest first)
      userLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setLogs(userLogs);
    };

    fetchProfileAndLogs();
  }, [user?.email]);

  const handleSave = async () => {
    try {
      await setDoc(doc(db, "user_profiles", user.email), {
        travel_mode: travel
      });
      setSaveMsg('Preference saved successfully! 🔥');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg('Error saving preference 😢');
    }
  };

  const handleReset = async () => {
    if (window.confirm("Sure you wanna wipe your logs clean, baby?")) {
      const snapshot = await getDocs(collection(db, "carbon_logs"));
      snapshot.forEach(async (docSnap) => {
        if (docSnap.data().user === user.email) {
          await deleteDoc(doc(db, "carbon_logs", docSnap.id));
        }
      });
      alert("All your carbon sins are gone… for now 🔥💨");
      setLogs([]); // Clear logs from UI too
    }
  };

  return (
    <div className="profile-container">
      <h2>🧍‍♀️ Your Eco Profile</h2>
      <p><strong>Email:</strong> {user?.email}</p>

      <div className="select-group">
        <label>Travel Preference:</label>
        <select value={travel} onChange={(e) => setTravel(e.target.value)}>
          <option value="car">🚗 Car</option>
          <option value="bike">🚴‍♀️ Bike</option>
          <option value="walk">🚶 Walk</option>
          <option value="bus">🚌 Bus</option>
          <option value="train">🚆 Train</option>
        </select>
      </div>

      <p className="current-pref">Your current travel preference is: <strong>{travel}</strong></p>

      <button onClick={handleSave} className="profile-btn">💾 Save Preference</button>
      <button onClick={handleReset} className="profile-btn reset-btn">🧨 Reset All My Logs</button>

      {saveMsg && <p className="save-msg">{saveMsg}</p>}

      <div className="logs-section">
        <h3>📜 Your Carbon Logs</h3>
        {logs.length > 0 ? (
          <ul>
            {logs.map((log, i) => (
              <li key={i} className="log-item">
                <strong>{new Date(log.timestamp).toLocaleString()}</strong> — 
                <span> {log.carbon_footprint} kg CO₂</span> — 
                <em> {log.advice}</em>
              </li>
            ))}
          </ul>
        ) : (
          <p>No logs found yet.</p>
        )}
      </div>
    </div>
  );
}
