// src/app/page.js

"use client";

import { useState, useEffect } from 'react';

export default function Home() {
  const [flameStatus, setFlameStatus] = useState(false);
  const [vibrationStatus, setVibrationStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/sensordata');
      const data = await response.json();
      // สมมุติว่าเซ็นเซอร์ส่งข้อมูล flameStatus และ vibrationStatus
      setFlameStatus(data.flameStatus);
      setVibrationStatus(data.vibrationStatus);
    };

    fetchData();
  }, []);

  const handleControl = async () => {
    await fetch('/api/control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle' }),
    });
  };

  return (
    <div>
      <h1>Sensor Status</h1>
      <p>Flame Sensor: {flameStatus ? 'Detected' : 'Not Detected'}</p>
      <p>Vibration Sensor: {vibrationStatus ? 'Detected' : 'Not Detected'}</p>
      <button onClick={handleControl}>Toggle LED & Laser</button>
    </div>
  );
}
