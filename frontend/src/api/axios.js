// frontend/src/api/axios.js

import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5500/api', // 你的后端地址+接口前缀
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
