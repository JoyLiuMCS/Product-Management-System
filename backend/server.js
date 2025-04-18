import express from 'express';

const app = express();
const PORT = 5500;

// ✅ 手动添加 CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

app.post('/api/products', (req, res) => {
  const { name, price, description } = req.body;
  console.log('✅ 收到前端传来的产品：', { name, price, description });
  res.status(201).json({ message: '产品已成功创建！' });
});

app.get('/', (req, res) => {
  res.send('✅ Backend is running');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

