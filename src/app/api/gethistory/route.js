import { Pool } from 'pg';

// Read connection value from environment variable
const DATABASE_URL = process.env.DATABASE_URL;

// Set up PostgreSQL connection
const client = new Pool({
    connectionString: DATABASE_URL,
});

export async function GET() {
    try {
        // Query to get the last 10 sensor data entries ordered by timestamp
        const result = await client.query(`
            SELECT timestamp, flame_status, vibration_status 
            FROM sensor_data
            ORDER BY timestamp DESC
            LIMIT 10
        `);

        // Check if data was retrieved
        if (result.rows.length === 0) {
            return new Response(JSON.stringify({ error: "No data found" }), {
                status: 404,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "Content-Type": "application/json"
                },
            });
        }

        return new Response(JSON.stringify(result.rows), {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json"
            },
        });
    } catch (error) {
        console.error("Error retrieving sensor data history:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json"
            },
        });
    }
}
