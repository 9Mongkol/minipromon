// pages/api/get-status.js

// Example of how you might fetch the current status of your sensors and LEDs
export default function handler(req, res) {
    const status = {
      flame: false,  // Replace with actual logic to check flame sensor
      vibration: false,  // Replace with actual logic to check vibration sensor
      led13: false,  // Replace with actual logic to check the status of LED 13
      led16: false   // Replace with actual logic to check the status of LED 16
    };
  
    // Return the status as JSON
    res.status(200).json(status);
  }
  