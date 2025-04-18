import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js';
import Product from './models/Product.js';

const app = express();
const PORT = 5500;

dotenv.config();      // 加载 .env 文件
connectDB();          // 连接 MongoDB
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

app.post('/api/products', async (req, res) => {
    try {
      const { name, price, description } = req.body;
      const product = new Product({ name, price, description });
      const savedProduct = await product.save();
  
      console.log('✅ 已保存产品：', savedProduct);
  
      res.status(201).json(savedProduct);
    } catch (err) {
      console.error('❌ 保存失败：', err.message);
      res.status(500).json({ error: '创建产品失败' });
    }
  });

  app.get('/api/products', async (req, res) => {
    try {
      const products = await Product.find(); // 查询所有产品
      res.json(products); // 返回 JSON 数据
    } catch (err) {
      console.error('❌ 获取产品失败：', err.message);
      res.status(500).json({ error: '获取产品失败' });
    }
  });

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

