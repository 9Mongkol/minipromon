// pages/api/toggle-led13.js

import { exec } from 'child_process';

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Run the command to toggle LED 13
    exec('python3 toggle_led13.py', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).json({ status: 'error', message: error.message });
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return res.status(500).json({ status: 'error', message: stderr });
      }
      console.log(`Stdout: ${stdout}`);
      res.status(200).json({ status: 'success', message: 'LED 13 toggled' });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
