// pages/api/test.js

export async function POST(request) {
    try {
      // Call the ESP32 API to activate LED and laser
      const response = await fetch('http://<ESP32_IP_ADDRESS>/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test' }),
      });
  
      const result = await response.json();
      if (response.ok) {
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        return new Response(JSON.stringify({ success: false, error: result.error }), {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  