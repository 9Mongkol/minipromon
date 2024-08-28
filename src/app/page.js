// pages/index.js

import { useState, useEffect } from 'react';

export default function Home() {
  const [flameStatus, setFlameStatus] = useState(false);
  const [vibrationStatus, setVibrationStatus] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // ฟังก์ชันเพื่อดึงสถานะจาก API
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/sensordata');
        const data = await response.json();
        if (data.length > 0) {
          const latest = data[0];
          setFlameStatus(latest.flame_status);
          setVibrationStatus(latest.vibration_status);
        }
      } catch (error) {
        console.error('Failed to fetch sensor data:', error);
      }
    };

    fetchStatus();
    // ดึงข้อมูลทุก 5 วินาที
    const intervalId = setInterval(fetchStatus, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleControl = async () => {
    try {
      await fetch('/api/control', { method: 'POST' });
      // อัพเดตประวัติการทำงาน
      setHistory([...history, { timestamp: new Date().toISOString(), action: 'LED and Laser ON for 2 seconds' }]);
    } catch (error) {
      console.error('Failed to control devices:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Sensor Dashboard</h1>
      <div>
        <h2>Flame Sensor Status: {flameStatus ? 'Detected' : 'Not Detected'}</h2>
        <h2>Vibration Sensor Status: {vibrationStatus ? 'Detected' : 'Not Detected'}</h2>
      </div>
      <button onClick={handleControl} style={{ marginTop: '20px' }}>
        Activate LED and Laser
      </button>
      <div style={{ marginTop: '20px' }}>
        <h2>History</h2>
        <ul>
          {history.map((entry, index) => (
            <li key={index}>{entry.timestamp} - {entry.action}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
