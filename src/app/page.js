"use client";
import { useState, useEffect } from 'react';

const Home = () => {
    const [responseMessage, setResponseMessage] = useState('');
    const [ledStatus, setLedStatus] = useState(null);
    const [sensorStatus, setSensorStatus] = useState({ flame: 'Not Detect', vibration: 'Not Detect' });

    useEffect(() => {
        // Fetch initial sensor status
        const fetchSensorData = async () => {
            try {
                const response = await fetch('/api/sensordata');
                if (!response.ok) throw new Error('Failed to fetch sensor data');
                const data = await response.json();
                
                // Update sensor status based on received data
                setSensorStatus({
                    flame: data.flame_status === "0" ? 'Detect' : 'Not Detect',
                    vibration: data.vibration_status === "1" ? 'Detect' : 'Not Detect'
                });

                // Update LED status
                setLedStatus(data.led_status);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchSensorData();
        const interval = setInterval(fetchSensorData, 3000); // Refresh every 3 seconds
        return () => clearInterval(interval);
    }, []);

    const handleUpdate = async (ledStatus) => {
        try {
            const response = await fetch('/api/sensordata', {
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
            setLedStatus(data.led_status);
            setResponseMessage(`LED status updated to ${data.led_status}`);
        } catch (error) {
            console.error('Error:', error);
            setResponseMessage('Error updating LED status');
        }
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#121212', color: '#e0e0e0' }}>
            <h1 style={{ textAlign: 'center', color: '#00e676' }}>Sensor and LED Control</h1>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ width: '48%', padding: '10px', borderRadius: '8px', backgroundColor: '#1e1e1e', boxShadow: '0 0 10px rgba(0,0,0,0.3)' }}>
                    <h2 style={{ color: '#00e676' }}>Sensor Status</h2>
                    <div style={{ marginBottom: '10px', padding: '10px', borderRadius: '4px', backgroundColor: '#2c2c2c' }}>
                        <strong>Flame Sensor:</strong> {sensorStatus.flame}
                    </div>
                    <div style={{ padding: '10px', borderRadius: '4px', backgroundColor: '#2c2c2c' }}>
                        <strong>Vibration Sensor:</strong> {sensorStatus.vibration}
                    </div>
                </div>
                
                <div style={{ width: '48%', padding: '10px', borderRadius: '8px', backgroundColor: '#1e1e1e', boxShadow: '0 0 10px rgba(0,0,0,0.3)' }}>
                    <h2 style={{ color: '#00e676' }}>LED Control</h2>
                    <button 
                        onClick={() => handleUpdate(1)} 
                        style={{ padding: '10px 20px', marginRight: '10px', border: 'none', borderRadius: '4px', backgroundColor: '#00e676', color: '#121212', cursor: 'pointer' }}>
                        Turn LED ON
                    </button>
                    <button 
                        onClick={() => handleUpdate(0)} 
                        style={{ padding: '10px 20px', border: 'none', borderRadius: '4px', backgroundColor: '#d32f2f', color: '#e0e0e0', cursor: 'pointer' }}>
                        Turn LED OFF
                    </button>
                    <p style={{ marginTop: '10px', color: '#e0e0e0' }}>{responseMessage}</p>
                    <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Current LED Status: {ledStatus === 1 ? 'ON' : 'OFF'}</p>
                </div>
            </div>
        </div>
    );
};
export default Home;
