// pages/index.js
'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [flameStatus, setFlameStatus] = useState(false);
  const [vibrationStatus, setVibrationStatus] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fetch initial data
    fetch('/api/sensordata')
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const latest = data[0];
          setFlameStatus(latest.flame_status);
          setVibrationStatus(latest.vibration_status);
        }
      });
  }, []);

  const handleTest = async () => {
    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test' }),
      });
      const result = await response.json();
      if (result.success) {
        alert('LED and laser activated!');
      } else {
        alert('Failed to activate LED and laser');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Sensor Dashboard</h1>
      <div>
        <h2>Status</h2>
        <p>Flame Sensor: {flameStatus ? 'Detected' : 'Not Detected'}</p>
        <p>Vibration Sensor: {vibrationStatus ? 'Detected' : 'Not Detected'}</p>
      </div>
      <button
        onClick={handleTest}
        style={{ padding: '10px 20px', fontSize: '16px', marginTop: '20px' }}
      >
        Test LED and Laser
      </button>
      <div>
        <h2>History</h2>
        <ul>
          {history.map((entry, index) => (
            <li key={index}>
              {entry.timestamp}: Flame: {entry.flame_status ? 'Detected' : 'Not Detected'}, Vibration: {entry.vibration_status ? 'Detected' : 'Not Detected'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
