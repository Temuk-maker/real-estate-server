// ----------------------------
// 📦 Шаардлагатай сангууд
// ----------------------------
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// ----------------------------
// 🧱 Статик файлуудыг serve хийх (HTML, CSS, JS)
// ----------------------------
app.use(express.static(path.join(__dirname, './')));

// ----------------------------
// 🏠 Root URL → home.html рүү автоматаар илгээх
// ----------------------------
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

// ----------------------------
// 📂 Upload хавтсыг бэлдэх
// ----------------------------
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ----------------------------
// 📸 Multer тохиргоо (зураг хадгалах)
// ----------------------------
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, uuid() + path.extname(file.originalname).toLowerCase())
});

const fileFilter = (_, file, cb) => {
  file.mimetype.startsWith('image/')
    ? cb(null, true)
    : cb(new Error('Зөвхөн зураг upload хийж болно'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
});

// ----------------------------
// 🧾 DB орлох array
// ----------------------------
let listings = [];

// ----------------------------
// 📤 Upload хавтасыг static болгох
// ----------------------------
app.use('/uploads', express.static(uploadDir));

// ----------------------------
// ➕ Зар нэмэх
// ----------------------------
app.post('/api/listings', upload.array('images'), (req, res) => {
  const { title, price, description, status } = req.body;

  if (!title || !price)
    return res.status(400).json({ message: 'Гарчиг ба үнэ шаардлагатай' });
  if (!req.files?.length)
    return res.status(400).json({ message: 'Дор хаяж нэг зураг оруулна уу' });

  const id = uuid();
  const editToken = uuid();

  const item = {
    id,
    title,
    price: Number(price),
    description,
    status,
    images: req.files.map(f => `/uploads/${f.filename}`),
    createdAt: new Date().toISOString(),
    editToken,
  };

  listings.push(item);

  res.json({
    ok: true,
    id,
    editUrl: `/edit.html?id=${id}&token=${editToken}`,
  });
});

// ----------------------------
// 📋 Фийд (зарын жагсаалт)
// ----------------------------
app.get('/api/feed', (req, res) => {
  const published = listings
    .filter(x => x.status === 'published')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const result = published.map(it => ({
    id: it.id,
    title: it.title,
    price: it.price,
    cover: it.images[0],
    description: it.description,
  }));

  res.json({ items: result });
});

// ----------------------------
// 🔍 Дэлгэрэнгүй
// ----------------------------
app.get('/api/listings/:id', (req, res) => {
  const it = listings.find(x => x.id === req.params.id);
  if (!it) return res.status(404).json({ message: 'Олдсонгүй' });
  res.json(it);
});

// ----------------------------
// ✏️ Засах
// ----------------------------
app.patch('/api/listings/:id', (req, res) => {
  const { token } = req.query;
  const it = listings.find(x => x.id === req.params.id);
  if (!it) return res.status(404).json({ message: 'Олдсонгүй' });
  if (it.editToken !== token) return res.status(403).json({ message: 'Хандах эрхгүй' });

  const { title, price, description, status } = req.body;
  if (title) it.title = title;
  if (price) it.price = Number(price);
  if (description) it.description = description;
  if (status) it.status = status;

  res.json({ ok: true, item: it });
});

// ----------------------------
// ❌ Устгах
// ----------------------------
app.delete('/api/listings/:id', (req, res) => {
  const { token } = req.query;
  const idx = listings.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Олдсонгүй' });
  if (listings[idx].editToken !== token) return res.status(403).json({ message: 'Хандах эрхгүй' });

  listings.splice(idx, 1);
  res.json({ ok: true });
});

// ----------------------------
// 🚀 Сервер асаах
// ----------------------------
const PORT = process.env.PORT || 3000;
// Root руу орсон хүн автоматаар home.html руу чиглэнэ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
