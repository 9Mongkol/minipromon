// server.js
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); // ให้สามารถอ่าน JSON request body ได้

app.post('/api/toggle-led13', (req, res) => {
  const status = req.body.status;

  // การทำงานกับ LED
  // เช่น เปิดหรือปิด LED ขา 13
  console.log('Received status:', status);

  // ส่ง response กลับไปที่ client
  res.status(200).json({ success: true });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
