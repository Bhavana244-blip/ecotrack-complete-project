import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { auth } from '../firebase';
import '../styles/Home.css';


export default function Home() {
  const [location, setLocation] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
        setLocation(coords);

        try {
          const res = await fetch('http://localhost:8000/track-location', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(coords)
          });

          const resData = await res.json();
          setData(resData);

          // SAVE TO FIRESTORE 🔥
          const uid = auth.currentUser.email;
          const timestamp = new Date().toISOString();

          await setDoc(doc(db, "carbon_logs", `${uid}_${timestamp}`), {
            user: uid,
            timestamp,
            latitude: coords.latitude,
            longitude: coords.longitude,
            carbon_footprint: resData.carbon_footprint,
            advice: resData.advice
          });

        } catch (err) {
          console.error('Something broke:', err);
          setError('Backend or Firestore failed ');
        }
      },
      (err) => {
        console.error('Location error:', err);
        setError('Location permission denied ');
      }
    );
  } else {
    setError('Geolocation not supported on your browser ');
  }
}, []);


  return (
  <div className="home-container">
    <h2>🌎 EcoTrack Live</h2>

    {error && <p className="error">{error}</p>}

    {location && (
      <p>📍 Your Location: {location.latitude}, {location.longitude}</p>
    )}

    {data && (
      <>
        <p>Carbon Footprint: {data.carbon_footprint} kg CO₂</p>
        <p>Advice: {data.advice}</p>
      </>
    )}

    {!location && !error && (
      <p className="loading">Waiting for you to share your location ...</p>
    )}
  </div>
);
}