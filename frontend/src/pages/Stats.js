import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import '../styles/Stats.css';

export default function Stats() {
  const [carbonData, setCarbonData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const uid = auth.currentUser.email;
      const q = query(collection(db, "carbon_logs"), where("user", "==", uid));

      const querySnapshot = await getDocs(q);
      const rawData = [];

      querySnapshot.forEach(doc => {
        const data = doc.data();
        rawData.push({
          date: new Date(data.timestamp).toLocaleDateString(),
          carbon: data.carbon_footprint
        });
      });

      // Group by date, sum carbon values
      const grouped = {};
      rawData.forEach(({ date, carbon }) => {
        grouped[date] = (grouped[date] || 0) + carbon;
      });

      const formatted = Object.entries(grouped).map(([date, carbon]) => ({
        date,
        carbon: Math.round(carbon * 100) / 100
      }));

      setCarbonData(formatted);
    };

    fetchData();
  }, []);

 return (
  <div className="stats-wrapper">
    <h2>📊 Your Carbon History</h2>
    {carbonData.length === 0 ? (
      <p>No data recorded yet. Start tracking your impact to see your progress and make a difference.</p>
    ) : (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={carbonData}
          margin={{ top: 30, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: 'kg CO₂', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type="monotone" dataKey="carbon" stroke="#00ffc8" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    )}
  </div>
);

}
