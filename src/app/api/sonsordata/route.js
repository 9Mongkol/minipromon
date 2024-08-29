// pages/api/sensordata.js

import { Pool } from 'pg';

// อ่านค่าการเชื่อมต่อจาก environment variable
const DATABASE_URL = process.env.DATABASE_URL;

// ตั้งค่าการเชื่อมต่อกับ PostgreSQL
const pool = new Pool({
  connectionString: DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { sensor_id, flame_status, vibration_status } = req.body;

    // ตรวจสอบว่า flame_status และ vibration_status เป็น Boolean หรือไม่
    if (typeof flame_status !== 'boolean' || typeof vibration_status !== 'boolean') {
      return res.status(400).json({ error: 'Invalid data type for status values' });
    }

    try {
      const client = await pool.connect();
      const query = `
        INSERT INTO sensor_data (sensor_id, flame_status, vibration_status, timestamp)
        VALUES ($1, $2, $3, NOW())
      `;
      await client.query(query, [sensor_id, flame_status, vibration_status]);
      client.release();
      res.status(201).json({ status: 'Data received' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
