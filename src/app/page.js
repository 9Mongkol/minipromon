"use client"; // Ensure this is a client-side component

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
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>LED Control and Sensor Status</h1>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={toggleLed13}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: led13Status ? '#f44336' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {led13Status ? 'Turn Off LED 13' : 'Turn On LED 13'}
        </button>
      </div>

      <div style={{ borderTop: '1px solid #ddd', paddingTop: '10px' }}>
        <h2 style={{ color: '#555' }}>Sensor Status</h2>
        <p style={{ fontSize: '18px' }}>Flame Detection: {status.flame ? 'Detected' : 'Not Detected'}</p>
        <p style={{ fontSize: '18px' }}>Vibration Detection: {status.vibration ? 'Detected' : 'Not Detected'}</p>
      </div>
    </div>
  );
};

export default Home;
