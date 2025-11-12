// --- НИЙТЛЭГДСЭН заруудын фийд (homepage) ---
// ?limit=12&offset=0 гэх мэтээр хуудаслаж болно.
app.get('/api/feed', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 24, 100);
  const offset = Math.max(Number(req.query.offset) || 0, 0);

  // published заруудыг createdAt буурахаар эрэмбэлнэ (шинэ нь эхэнд)
  const published = listings
    .filter(x => x.status === 'published')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const slice = published.slice(offset, offset + limit);

  // cover = images[0]
  const items = slice.map(x => ({
    id: x.id,
    title: x.title,
    price: x.price,
    cover: x.images?.[0] || null,
    createdAt: x.createdAt
  }));

  res.json({ total: published.length, items });
});

// --- Тухайн зарын дэлгэрэнгүй (өмнө байсан route) ---
// app.get('/api/listings/:id', ...) аль хэдийнээ байгаа;
// байхгүй бол өмнөх демоосоо хуулж оруулаарай.
