"use client";
import { useState, useEffect } from 'react';

const Home = () => {
    const [responseMessage, setResponseMessage] = useState('');
    const [sensorStatus, setSensorStatus] = useState({ flame_status: 'Unknown', vibration_status: 'Unknown' });
    const [ledStatus, setLedStatus] = useState('Unknown');
    const [history, setHistory] = useState([]);

    useEffect(() => {
        // Fetch the initial sensor and LED statuses
        const fetchStatus = async () => {
            try {
                const sensorResponse = await fetch('/api/sensordata');
                const ledResponse = await fetch('/api/getLedStatus');
                if (sensorResponse.ok && ledResponse.ok) {
                    const sensorData = await sensorResponse.json();
                    const ledData = await ledResponse.json();
                    setSensorStatus(sensorData);
                    setLedStatus(ledData.led_status);
                }
            } catch (error) {
                console.error('Error fetching initial statuses:', error);
            }
        };
        fetchStatus();
    }, []);

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
            setLedStatus(data.led_status);
            setHistory((prevHistory) => [
                ...prevHistory,
                { timestamp: new Date().toLocaleString(), action: `LED set to ${data.led_status}` },
            ]);
        } catch (error) {
            console.error('Error:', error);
            setResponseMessage('Error updating LED status');
        }
    };

    return (
        <div style={{ color: 'black' }}>
            <h1>LED & Sensor Control Panel</h1>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', width: '45%' }}>
                    <h2>Sensor Status</h2>
                    <p>Flame Sensor: {sensorStatus.flame_status ? 'Detected' : 'Not Detected'}</p>
                    <p>Vibration Sensor: {sensorStatus.vibration_status ? 'Detected' : 'Not Detected'}</p>
                </div>

                <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', width: '45%' }}>
                    <h2>LED Control</h2>
                    <button onClick={() => handleUpdate(1)}>Turn LED ON</button>
                    <button onClick={() => handleUpdate(0)}>Turn LED OFF</button>
                    <p>{responseMessage}</p>
                    <p>Current LED Status: {ledStatus ? 'ON' : 'OFF'}</p>
                </div>
            </div>

            <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                <h2>History</h2>
                <ul>
                    {history.map((entry, index) => (
                        <li key={index}>{entry.timestamp}: {entry.action}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Home;
