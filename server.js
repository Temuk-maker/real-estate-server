const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const app = express();
app.use(cors());

// uploads/ үүсгэнэ
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, uuid() + ext);
  }
});
const fileFilter = (_, file, cb) =>
  file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Зөвхөн зураг'));

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 100 }
});

// Энэ жагсаалт = DB орлох array
let listings = [];

// Upload хавтасыг static болгоно
app.use('/uploads', express.static(uploadDir));

// Зар хадгалах
app.post('/api/listings', upload.array('images'), (req, res) => {
  const { title, price, description, status } = req.body;

  if (!title || !price) {
    return res.status(400).json({ message: 'Title/price шаардлагатай' });
  }
  if (!req.files?.length) {
    return res.status(400).json({ message: 'Дор хаяж 1 зураг' });
  }

  const id = uuid();
  const item = {
    id,
    title,
    price: Number(price),
    description,
    status,
    images: req.files.map(f => `/uploads/${f.filename}`),
    createdAt: new Date().toISOString()
  };
  listings.push(item);

  res.json({ ok: true, id, item });
});

// Фийд өгөх (published л гарна)
app.get('/api/feed', (req, res) => {
  const published = listings
    .filter(x => x.status === 'published')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const result = published.map(it => ({
    id: it.id,
    title: it.title,
    price: it.price,
    cover: it.images[0],
    description: it.description
  }));

  res.json({ items: result });
});

// Дэлгэрэнгүй
app.get('/api/listings/:id', (req, res) => {
  const it = listings.find(x => x.id === req.params.id);
  if (!it) return res.status(404).json({ message: 'Олдсонгүй' });
  res.json(it);
});

// Сервер асаах
app.listen(3000, () => {
  console.log('✅ Server: http://localhost:3000');
});


// ... бусад код яг хэвээр

// ✅ Зар хадгалах (шинэчлэлтэй)
app.post('/api/listings', upload.array('images'), (req, res) => {
  const { title, price, description, status } = req.body;
  if (!title || !price) return res.status(400).json({ message: 'Title/price шаардлагатай' });
  if (!req.files?.length) return res.status(400).json({ message: 'Дор хаяж 1 зураг' });

  const id = uuid();
  const editToken = uuid(); // 🔑 нууц token
  const item = {
    id,
    title,
    price: Number(price),
    description,
    status,
    images: req.files.map(f => `/uploads/${f.filename}`),
    createdAt: new Date().toISOString(),
    editToken, // 🔒 хадгална
  };
  listings.push(item);

  // Клиентэд edit линк буцаана
  res.json({
    ok: true,
    id,
    item,
    editUrl: `/edit.html?id=${id}&token=${editToken}`,
  });
});

// ✅ Засвар хийх endpoint
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

// ✅ Устгах endpoint
app.delete('/api/listings/:id', (req, res) => {
  const { token } = req.query;
  const idx = listings.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Олдсонгүй' });
  if (listings[idx].editToken !== token) return res.status(403).json({ message: 'Хандах эрхгүй' });
  listings.splice(idx, 1);
  res.json({ ok: true });
});
