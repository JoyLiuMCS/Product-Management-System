import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './db.js';
import Product from './models/Product.js';
import User from './models/User.js';

const app = express();
const PORT = 5500;

dotenv.config();
connectDB();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.sendStatus(200);
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
      quantity: quantity ?? 50,
      imageUrl
    });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: 'Product creation failed', details: err.message });
  }
});


app.get('/api/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortOrder = req.query.sort || 'asc';
    const search = req.query.search || '';  

    let sortObj = { createdAt: -1 };
    if (sortOrder === 'asc') sortObj = { price: 1 };
    else if (sortOrder === 'desc') sortObj = { price: -1 };
    else if (sortOrder === 'latest') sortObj = { createdAt: -1 };

    const query = search
      ? { name: { $regex: search, $options: 'i' } } // i = ignore case
      : {};

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get product', details: err.message });
  }
});


app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get product', details: err.message });
  }
});

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
    res.status(500).json({ error: 'Failed to update product', details: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Product deletion failed', details: err.message });
  }
});


app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      role: 'user'
    });
    const savedUser = await newUser.save();
    const { password: _, ...userWithoutPassword } = savedUser.toObject();
    res.status(201).json({ message: 'Signup successful', user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed', details: err.message });
  }
});

app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({ message: 'Sign-in successful', user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: 'Error during sign-in', details: err.message });
  }
});

app.post('/api/create-admin', async (req, res) => {
  const { email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: 'Already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const admin = new User({ email, password: hashed, role: 'admin' });
  await admin.save();
  res.status(201).json({ message: 'Admin created' });
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('+password');
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
