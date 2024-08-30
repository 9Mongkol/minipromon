"use client";
import { useState, useEffect } from 'react';

const Home = () => {
    const [responseMessage, setResponseMessage] = useState('');
    const [sensorStatus, setSensorStatus] = useState({ flame: 'Loading...', vibration: 'Loading...' });

    // ฟังก์ชันอัปเดตสถานะ LED
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
            setResponseMessage(`LED status updated to ${data.led_status}`);
        } catch (error) {
            console.error('Error:', error);
            setResponseMessage('Error updating LED status');
        }
    };

    // ฟังก์ชันดึงข้อมูลสถานะเซนเซอร์
    const fetchSensorStatus = async () => {
        try {
            const response = await fetch('/api/sensordata');
            if (!response.ok) {
                throw new Error('Failed to fetch sensor status');
            }

            const data = await response.json();
            setSensorStatus({
                flame: data.flame_status === '1' ? 'Detected' : 'Not Detected',
                vibration: data.vibration_status === '1' ? 'Detected' : 'Not Detected',
            });
        } catch (error) {
            console.error('Error:', error);
            setSensorStatus({ flame: 'Error', vibration: 'Error' });
        }
    };

    // เรียกใช้ฟังก์ชัน fetchSensorStatus เมื่อ component ถูก mount
    useEffect(() => {
        fetchSensorStatus();
    }, []);

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>LED & Sensor Control</h1>
            <div style={styles.buttonContainer}>
                <button style={styles.button} onClick={() => handleUpdate(1)}>Turn LED ON</button>
                <button style={styles.button} onClick={() => handleUpdate(0)}>Turn LED OFF</button>
            </div>
            <p style={styles.response}>{responseMessage}</p>
            <div style={styles.sensorContainer}>
                <h2>Sensor Status</h2>
                <p>Flame Sensor: {sensorStatus.flame}</p>
                <p>Vibration Sensor: {sensorStatus.vibration}</p>
            </div>
        </div>
    );
};

// สไตล์สำหรับตกแต่งหน้าเว็บ
const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f4f4f4',
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
    header: {
        fontSize: '24px',
        marginBottom: '20px',
        color: '#333',
    },
    buttonContainer: {
        marginBottom: '20px',
    },
    button: {
        padding: '10px 20px',
        margin: '5px',
        fontSize: '16px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#4CAF50',
        color: 'white',
        cursor: 'pointer',
    },
    response: {
        fontSize: '16px',
        color: '#555',
        marginTop: '20px',
    },
    sensorContainer: {
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#e8e8e8',
        borderRadius: '5px',
    },
};

export default Home;
