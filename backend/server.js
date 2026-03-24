const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const feedbackRoutes = require('./routes/feedback');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 数据库连接
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/feedback';

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('数据库连接成功');
})
.catch((error) => {
  console.error('数据库连接失败:', error);
  process.exit(1);
});

// 路由
app.use('/api/feedback', feedbackRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});