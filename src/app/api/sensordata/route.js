"use server";
import { Client } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize PostgreSQL client
const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

// Connect to the database
client.connect().catch((err) => {
    console.error("Database connection error:", err);
});

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(request) {
    try {
        // Parse the request body as JSON
        const requestBody = await request.json();
        const { sensor_id, flame_status, vibration_status } = requestBody;

        // Insert new data into the table
        const result = await client.query(
            'INSERT INTO sensor_data (sensor_id, flame_status, vibration_status) VALUES ($1, $2, $3) RETURNING *',
            [sensor_id, flame_status, vibration_status]
        );

        return new Response(JSON.stringify(result.rows[0]), {
            status: 201,
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
            },
        });
    } catch (error) {
        console.error("Error inserting data:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
}
//------------------------------------------------------------------------------------------------

export async function GET(request) {
    try {
        // Query the database for the latest led_status
        const result = await client.query('SELECT led_status FROM sensor_data WHERE id = 1 ORDER BY id DESC LIMIT 1');

        if (result.rows.length === 0) {
            return new Response(JSON.stringify({ error: "No data found" }), {
                status: 404,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const ledStatus = result.rows[0].led_status;

        return new Response(JSON.stringify({ led_status: ledStatus }), {
            status: 200,
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
            },
        });
    } catch (error) {
        console.error("Error retrieving LED status:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
}
