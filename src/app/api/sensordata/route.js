import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const handleError = (error) => {
  console.error('Database error:', error);
  return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
};

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM sensor_data');
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request) {
  try {
    const { sensor_id, vibration_status } = await request.json();

    if (!sensor_id || vibration_status === undefined) {
      return new Response(JSON.stringify({ error: 'Invalid input data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const res = await pool.query(
      'INSERT INTO sensor_data (sensor_id, vibration_status) VALUES ($1, $2) RETURNING *',
      [sensor_id, vibration_status]
    );

    return new Response(JSON.stringify(res.rows[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request) {
  try {
    const { id, sensor_id, vibration_status } = await request.json();

    if (!id || !sensor_id || vibration_status === undefined) {
      return new Response(JSON.stringify({ error: 'Invalid input data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const res = await pool.query(
      'UPDATE sensor_data SET sensor_id = $1, vibration_status = $2 WHERE id = $3 RETURNING *',
      [sensor_id, vibration_status, id]
    );

    if (res.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Data not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(res.rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'Invalid input data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const res = await pool.query('DELETE FROM sensor_data WHERE id = $1 RETURNING *', [id]);

    if (res.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Data not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(res.rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return handleError(error);
  }
}
