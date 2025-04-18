// backend/models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      default: 50,
      min: 0
    },    
    category: {
      type: String,
      enum: ['food', 'electronics', 'clothing'],
      required: true,
    }, 
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // 自动添加 createdAt 和 updatedAt 时间戳
  }
);

// 创建模型并导出
const Product = mongoose.model('Product', productSchema);
export default Product;
