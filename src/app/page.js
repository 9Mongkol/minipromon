// src/app/page.js

"use client"; // เพิ่มบรรทัดนี้เพื่อกำหนดให้คอมโพเนนต์เป็น Client Component

import { useState, useEffect } from 'react';

const Home = () => {
  const [status, setStatus] = useState({ flame: false, vibration: false });

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/sensordata');
      const data = await response.json();
      setStatus({
        flame: data.find((item) => item.sensor_id === 1)?.flame_status || false,
        vibration: data.find((item) => item.sensor_id === 1)?.vibration_status || false,
      });
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // อัพเดตทุก 5 วินาที
    return () => clearInterval(interval);
  }, []);

  const testComponents = async () => {
    try {
      await fetch('/api/sensordata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sensor_id: 1, vibration_status: true }),
      });
      console.log('Test command sent');
    } catch (error) {
      console.error('Error sending test command:', error);
    }
  };

  return (
    <div>
      <h1>Sensor Status</h1>
      <p>Flame Detected: {status.flame ? 'Yes' : 'No'}</p>
      <p>Vibration Detected: {status.vibration ? 'Yes' : 'No'}</p>
      <button onClick={testComponents}>Test Components</button>
    </div>
  );
};

export default Home;
