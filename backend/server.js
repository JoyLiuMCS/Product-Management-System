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
      const { name, price, description, category, quantity, imageUrl } = req.body;
  
      const product = new Product({
        name,
        price,
        description,
        category,
        quantity,
        imageUrl
      });
  
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
      const page = parseInt(req.query.page) || 1;    // 当前页码
      const limit = parseInt(req.query.limit) || 10; // 每页产品数量
  
      const skip = (page - 1) * limit;
  
      const total = await Product.countDocuments(); // 产品总数
      const products = await Product.find().skip(skip).limit(limit);
  
      res.json({
        products,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      });
    } catch (err) {
      console.error('❌ 获取产品失败：', err.message);
      res.status(500).json({ error: '获取产品失败' });
    }
  });
  

  // 获取单个产品
app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ error: '找不到该产品' });
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: '获取产品失败' });
    }
  });
  
  // 更新产品
  app.put('/api/products/:id', async (req, res) => {
    try {
      const { name, price, description, category, quantity, imageUrl } = req.body;
  
      const updated = await Product.findByIdAndUpdate(
        req.params.id,
        { name, price, description, category, quantity, imageUrl },
        { new: true }
      );
  
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: '更新产品失败' });
    }
  });
  
  
  app.delete('/api/products/:id', async (req, res) => {
    try {
      const deleted = await Product.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: '产品未找到' });
      }
      res.json({ message: '产品已删除' });
    } catch (err) {
      console.error('❌ 删除失败：', err.message);
      res.status(500).json({ error: '删除失败' });
    }
  });
  

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

