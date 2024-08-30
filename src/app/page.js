"use client";
import { useState } from 'react';

const Home = () => {
    const [responseMessage, setResponseMessage] = useState('');

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

    return (
        <div>
            <h1>LED Control</h1>
            <button onClick={() => handleUpdate(1)}>Turn LED ON</button>
            <button onClick={() => handleUpdate(0)}>Turn LED OFF</button>
            <p>{responseMessage}</p>
        </div>
    );
};

export default Home;