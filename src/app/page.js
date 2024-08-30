"use client";
import { useState, useEffect } from 'react';

const Home = () => {
    const [responseMessage, setResponseMessage] = useState('');
    const [ledStatus, setLedStatus] = useState(null);
    const [sensorStatus, setSensorStatus] = useState({ flame: 'undetected', vibration: 'undetected' });

    useEffect(() => {
        // Fetch initial LED status
        const fetchLedStatus = async () => {
            try {
                const response = await fetch('/api/sensordata');
                if (!response.ok) throw new Error('Failed to fetch LED status');
                const data = await response.json();
                setLedStatus(data.led_status);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchLedStatus();
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
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f0f0f0' }}>
            <h1 style={{ textAlign: 'center', color: '#333' }}>Sensor and LED Control</h1>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ width: '48%', padding: '10px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#333' }}>Sensor Status</h2>
                    <div style={{ marginBottom: '10px', padding: '10px', borderRadius: '4px', backgroundColor: '#e0f7fa' }}>
                        <strong>Flame Sensor:</strong> {sensorStatus.flame}
                    </div>
                    <div style={{ padding: '10px', borderRadius: '4px', backgroundColor: '#e0f7fa' }}>
                        <strong>Vibration Sensor:</strong> {sensorStatus.vibration}
                    </div>
                </div>
                
                <div style={{ width: '48%', padding: '10px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ color: '#333' }}>LED Control</h2>
                    <button 
                        onClick={() => handleUpdate(1)} 
                        style={{ padding: '10px 20px', marginRight: '10px', border: 'none', borderRadius: '4px', backgroundColor: '#4caf50', color: '#fff', cursor: 'pointer' }}>
                        Turn LED ON
                    </button>
                    <button 
                        onClick={() => handleUpdate(0)} 
                        style={{ padding: '10px 20px', border: 'none', borderRadius: '4px', backgroundColor: '#f44336', color: '#fff', cursor: 'pointer' }}>
                        Turn LED OFF
                    </button>
                    <p style={{ marginTop: '10px', color: '#333' }}>{responseMessage}</p>
                    <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Current LED Status: {ledStatus === 1 ? 'ON' : 'OFF'}</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
