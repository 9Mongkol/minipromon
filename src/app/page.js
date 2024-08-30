"use client";
import { useState, useEffect } from 'react';

const Home = () => {
    const [flameStatus, setFlameStatus] = useState(false);
    const [vibrationStatus, setVibrationStatus] = useState(false);
    const [ledStatus, setLedStatus] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');

    const fetchSensorData = async () => {
        try {
            const response = await fetch('/api/sensordata');
            const data = await response.json();
            
            if (data.length > 0) {
                const latestData = data[data.length - 1];
                setFlameStatus(latestData.flame_status);
                setVibrationStatus(latestData.vibration_status);
            }
        } catch (error) {
            console.error('Error fetching sensor data:', error);
        }
    };

    const handleUpdate = async (newLedStatus) => {
        try {
            const response = await fetch('/api/updateLedStatus', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    led_status: newLedStatus,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update LED status');
            }

            const data = await response.json();
            setResponseMessage(`LED status updated to ${data.led_status}`);
            setLedStatus(data.led_status === 1);
        } catch (error) {
            console.error('Error:', error);
            setResponseMessage('Error updating LED status');
        }
    };

    useEffect(() => {
        fetchSensorData();
        const intervalId = setInterval(() => {
            fetchSensorData();
        }, 5000); // Fetch data every 5 seconds

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#121212', color: '#ffffff', padding: '20px', minHeight: '100vh' }}>
            <h1 style={{ color: '#00FF00' }}>Sensor Status</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ flex: 1, backgroundColor: '#333333', padding: '10px', borderRadius: '8px', color: '#ffffff' }}>
                    <h2>Flame Sensor</h2>
                    <p>Status: {flameStatus ? 'Flame Detected' : 'No Flame Detected'}</p>
                </div>
                <div style={{ flex: 1, backgroundColor: '#333333', padding: '10px', borderRadius: '8px', color: '#ffffff' }}>
                    <h2>Vibration Sensor</h2>
                    <p>Status: {vibrationStatus ? 'Vibration Detected' : 'No Vibration Detected'}</p>
                </div>
            </div>
            <div style={{ backgroundColor: '#333333', padding: '10px', borderRadius: '8px', color: '#ffffff', marginBottom: '20px' }}>
                <h2>LED Control</h2>
                <button
                    style={{ backgroundColor: ledStatus ? '#00FF00' : '#555555', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}
                    onClick={() => handleUpdate(1)}
                >
                    Turn LED ON
                </button>
                <button
                    style={{ backgroundColor: !ledStatus ? '#FF0000' : '#555555', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
                    onClick={() => handleUpdate(0)}
                >
                    Turn LED OFF
                </button>
                <p>{responseMessage}</p>
            </div>
        </div>
    );
};

export default Home;
