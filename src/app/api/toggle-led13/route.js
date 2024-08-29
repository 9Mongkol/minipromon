export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { status } = req.body;

    try {
      // Replace this with your actual endpoint and data handling
      const response = await fetch('http://<YOUR_PI_PICO_IP>/toggle_led13', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        res.status(200).json({ message: 'LED 13 toggled successfully' });
      } else {
        res.status(response.status).json({ error: 'Failed to toggle LED 13' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
