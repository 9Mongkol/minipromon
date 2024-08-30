"use client";
import { useState, useEffect } from 'react';

const Home = () => {
    const [flameStatus, setFlameStatus] = useState('Not Detect');
    const [vibrationStatus, setVibrationStatus] = useState('Not Detect');
    const [ledStatus, setLedStatus] = useState(0);
    const [responseMessage, setResponseMessage] = useState('');

    const fetchSensorData = async () => {
        try {
            const response = await fetch('/api/sensordata');
            const data = await response.json();
            
            // แปลงสถานะของ flame_sensor
            if (data.flame_status === 0) {
                setFlameStatus('Detect');
            } else {
                setFlameStatus('Not Detect');
            }

            // แปลงสถานะของ vibration_sensor
            if (data.vibration_status === 1) {
                setVibrationStatus('Detect');
            } else {
                setVibrationStatus('Not Detect');
            }

            // อัปเดตสถานะของ LED
            if (data.led_status !== undefined) {
                setLedStatus(data.led_status);
            }
        } catch (error) {
            console.error('Error fetching sensor data:', error);
        }
    };

    const handleUpdate = async (ledStatus) => {
        try {
            const response = await fetch('/api/updateLedStatus', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    led_status: ledStatus,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update LED status');
            }

            const data = await response.json();
            setResponseMessage(`LED status updated to ${data.led_status}`);
        } catch (error) {
            console.error('Error:', error);
            setResponseMessage('Error updating LED status');
        }
    };

    useEffect(() => {
        fetchSensorData();
        const interval = setInterval(fetchSensorData, 3000); // Refresh every 3 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#121212', color: '#E0E0E0', padding: '20px' }}>
            <h1>Sensor and LED Control</h1>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-around' }}>
                <div style={{ backgroundColor: '#1E1E1E', padding: '15px', borderRadius: '8px', width: '45%' }}>
                    <h2>Flame Sensor Status</h2>
                    <p style={{ fontSize: '18px', color: flameStatus === 'Detect' ? 'lightgreen' : 'red' }}>{flameStatus}</p>
                </div>
                <div style={{ backgroundColor: '#1E1E1E', padding: '15px', borderRadius: '8px', width: '45%' }}>
                    <h2>Vibration Sensor Status</h2>
                    <p style={{ fontSize: '18px', color: vibrationStatus === 'Detect' ? 'lightgreen' : 'red' }}>{vibrationStatus}</p>
                </div>
            </div>
            <div style={{ marginBottom: '20px', backgroundColor: '#1E1E1E', padding: '15px', borderRadius: '8px' }}>
                <h2>LED Control</h2>
                <button onClick={() => handleUpdate(1)} style={{ marginRight: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px' }}>Turn LED ON</button>
                <button onClick={() => handleUpdate(0)} style={{ backgroundColor: '#F44336', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px' }}>Turn LED OFF</button>
                <p style={{ marginTop: '10px', fontSize: '18px', color: '#E0E0E0' }}>Current LED Status: {ledStatus === 1 ? 'ON' : 'OFF'}</p>
                <p style={{ color: '#F44336' }}>{responseMessage}</p>
            </div>
        </div>
    );
};

export default Home;
