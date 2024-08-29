"use client";  // Ensure this is a client-side component

import { useState, useEffect } from 'react';

const Home = () => {
  const [led13Status, setLed13Status] = useState(false);
  const [status, setStatus] = useState({ flame: false, vibration: false });

  // Function to toggle LED 13
  const toggleLed13 = async () => {
    const newStatus = !led13Status;
    setLed13Status(newStatus);

    const response = await fetch('/api/toggle-led13', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      console.log('LED 13 toggled successfully');
    } else {
      console.error('Failed to toggle LED 13');
    }
  };

  useEffect(() => {
    // Fetch current status from the server
    const fetchStatus = async () => {
      const response = await fetch('/api/get-status');
      const data = await response.json();
      setStatus(data);
    };
    fetchStatus();
  }, []);

  return (
    <div>
      <h1>LED Control and Sensor Status</h1>
      <button onClick={toggleLed13}>
        {led13Status ? 'Turn Off LED 13' : 'Turn On LED 13'}
      </button>

      <h2>Sensor Status</h2>
      <p>Flame Detection: {status.flame ? 'Detected' : 'Not Detected'}</p>
      <p>Vibration Detection: {status.vibration ? 'Detected' : 'Not Detected'}</p>
    </div>
  );
};

export default Home;
