// pages/api/sensordata.js

import { Pool } from 'pg';

// อ่านค่าการเชื่อมต่อจาก environment variable
const DATABASE_URL = process.env.DATABASE_URL;

// ตั้งค่าการเชื่อมต่อกับ PostgreSQL
const client = new Pool({
  connectionString: DATABASE_URL,
});

export async function GET() {
    try {
      const result = await client.query(`
        SELECT * 
        FROM sensor_data
      `);
      return new Response(JSON.stringify(result.rows), {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        },
      });
    } catch (error) {
  
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*', "Content-Type": "application/json" },
      });
    }
  }
  