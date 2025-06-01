import express from "express";
import fetch from "node-fetch";
import multer from "multer";
import cors from "cors";

const app = express();
const upload = multer();
const PORT = 3001;

// Thay API Key của bạn
const TUSKY_API_URL = "https://api.tusky.io";
const TUSKY_API_KEY = "abad7807-d55e-49f3-af26-2edc3349ec5f";
const TUSKY_VAULT_ID = "b62fe52a-9473-4cbe-828e-60b1209b46be";

app.use(cors()); // Cho phép mọi origin, có thể cấu hình lại nếu cần

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    const tuskyUrl = `${TUSKY_API_URL}/uploads?vaultId=${TUSKY_VAULT_ID}&filename=${encodeURIComponent(file.originalname)}`;
    const response = await fetch(tuskyUrl, {
      method: 'POST',
      headers: {
        'Api-Key': TUSKY_API_KEY,
        'Content-Type': 'application/offset+octet-stream',
      },
      body: file.buffer,
    });
    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: 'Tusky upload failed', detail: text });
    }
    const location = response.headers.get('location');
    if (!location) return res.status(500).json({ error: 'No location header from Tusky' });
    return res.json({ location });
  } catch (err) {
    console.error('[server.js] Upload error:', err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Tusky proxy server listening on port ${PORT}`);
});