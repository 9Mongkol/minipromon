"use client";
import { useState, useEffect } from 'react';

const Home = () => {
    const [responseMessage, setResponseMessage] = useState('');
    const [ledStatus, setLedStatus] = useState(null);
    const [sensorStatus, setSensorStatus] = useState({ flame: 'Loading...', vibration: 'Loading...' });
    const [sensorDataHistory, setSensorDataHistory] = useState([]);

    useEffect(() => {
        // Fetch initial sensor status and led status
        const fetchRecentData = async () => {
            try {
                const response = await fetch('/api/getrecent');
                if (!response.ok) throw new Error('Failed to fetch sensor data');
                const data = await response.json();
    
                console.log('Fetched sensor data:', data);
    
                // Update sensor status based on received data
                setSensorStatus({
                    flame: data.flame_status === "0" ? 'Detect' : 'Not Detect',
                    vibration: data.vibration_status === "1" ? 'Detect' : 'Not Detect'
                });

                // Fetch LED status from /api/sensordata
                const ledResponse = await fetch('/api/sensordata');
                if (!ledResponse.ok) throw new Error('Failed to fetch LED status');
                const ledData = await ledResponse.json();
                setLedStatus(ledData.led_status);

                // Fetch historical data
                const historyResponse = await fetch('/api/gethistory');
                if (!historyResponse.ok) throw new Error('Failed to fetch sensor history');
                const historyData = await historyResponse.json();
                setSensorDataHistory(historyData);

            } catch (error) {
                console.error('Error:', error);
                setSensorStatus({ flame: 'Error', vibration: 'Error' });
            }
        };
    
        fetchRecentData();
    
        // Update data every 5 seconds
        const intervalId = setInterval(fetchRecentData, 2000);
    
        return () => clearInterval(intervalId);
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
                    <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Current LED Status: {ledStatus === 1 ? 'ON' : ledStatus === 0 ? 'OFF' : 'Loading...'}</p>
                </div>
            </div>

            <h2 style={{ color: '#00e676', marginBottom: '10px' }}>Sensor Data History</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1e1e1e' }}>
                <thead>
                    <tr>
                        <th style={{ padding: '10px', border: '1px solid #2c2c2c', color: '#e0e0e0' }}>Timestamp</th>
                        <th style={{ padding: '10px', border: '1px solid #2c2c2c', color: '#e0e0e0' }}>Flame Status</th>
                        <th style={{ padding: '10px', border: '1px solid #2c2c2c', color: '#e0e0e0' }}>Vibration Status</th>
                    </tr>
                </thead>
                <tbody>
                    {sensorDataHistory.map((entry, index) => (
                        <tr key={index}>
                            <td style={{ padding: '10px', border: '1px solid #2c2c2c', color: '#e0e0e0' }}>{entry.timestamp}</td>
                            <td style={{ padding: '10px', border: '1px solid #2c2c2c', color: '#e0e0e0' }}>{entry.flame_status === "0" ? 'Detect' : 'Not Detect'}</td>
                            <td style={{ padding: '10px', border: '1px solid #2c2c2c', color: '#e0e0e0' }}>{entry.vibration_status === "1" ? 'Detect' : 'Not Detect'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};
export default Home;
