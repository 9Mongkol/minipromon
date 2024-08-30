export async function GET(request) {
  try {
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
