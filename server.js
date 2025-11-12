import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =======================
// 📦 Номын санууд дуудах
// =======================
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const app = express();
app.use(cors());

// =======================
// 🧱 Статик файлууд (HTML, CSS, JS) serve хийх
// =======================
app.use(express.static(__dirname));

// =======================
// 📂 Uploads фолдер бэлдэх
// =======================
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// =======================
// 📸 Multer тохиргоо (зураг хадгалах)
// =======================
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuid() + ext);
  },
});
const upload = multer({ storage });

// =======================
// 💾 Түр data хадгалах (жишээ JSON array)
// =======================
let listings = [];

// =======================
// 📤 Зар нэмэх (POST /api/listings)
// =======================
app.post('/api/listings', upload.array('images'), (req, res) => {
  const { title, price, description, status } = req.body;
  const id = uuid();

  const images = req.files.map(f => '/uploads/' + f.filename);

  const newItem = { id, title, price, description, images, status };
  listings.push(newItem);

  res.json({ message: 'Амжилттай нэмлээ', item: newItem });
});

// =======================
// 📃 Бүх зар авах (GET /api/feed)
// =======================
app.get('/api/feed', (req, res) => {
  res.json({ items: listings });
});

// =======================
// 🔍 Нэг зар авах (GET /api/listings/:id)
// =======================
app.get('/api/listings/:id', (req, res) => {
  const it = listings.find(x => x.id === req.params.id);
  if (!it) return res.status(404).json({ message: 'Олдсонгүй' });
  res.json(it);
});

// =======================
// 🗑️ Зар устгах (DELETE /api/listings/:id)
// =======================
app.delete('/api/listings/:id', (req, res) => {
  const idx = listings.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Олдсонгүй' });
  listings.splice(idx, 1);
  res.json({ ok: true });
});

// =======================
// 🏠 Root — home.html руу автоматаар илгээх
// =======================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

// =======================
// 🚀 Сервер асаах
// =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});
// ✅ Static файлуудыг serve хийх
app.use(express.static(__dirname));

// ✅ Root руу орсон хэрэглэгчийг home.html рүү автоматаар илгээх
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});
