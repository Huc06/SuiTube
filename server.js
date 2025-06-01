import express from "express";
import fetch from "node-fetch"; 
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 5173;

// Thay API Key của bạn
const TUSKY_API_URL = "https://api.tusky.io";
const TUSKY_API_KEY = "abad7807-d55e-49f3-af26-2edc3349ec5f";

// Nếu dùng ES module, cần 2 dòng này để lấy __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files từ thư mục build của Vite
app.use(express.static(path.join(__dirname, "dist/public")));

// Proxy endpoint (API) - ĐẶT TRƯỚC
app.get("/api/tusky-files", async (req, res) => {
  const { vaultId } = req.query;
  if (!vaultId) return res.status(400).json({ error: "Missing vaultId" });

  try {
    const tuskyRes = await fetch(`${TUSKY_API_URL}/files?vaultId=${vaultId}`, {
      headers: { "Api-Key": TUSKY_API_KEY },
    });

    if (!tuskyRes.ok) throw new Error("Tusky GET files failed");
    const data = await tuskyRes.json();

    // Mapping về dạng Video[] để frontend dùng luôn
    const videos = (data.items || []).map((item) => ({
      id: item.id,
      title: item.name,
      thumbnailUrl: "", // Update nếu API trả về field tương ứng
      duration: "",     // Update nếu có
      views: 0,         // Update nếu có
    }));

    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tất cả route khác trả về index.html (SPA) - ĐẶT SAU CÙNG
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/public", "index.html"));
});