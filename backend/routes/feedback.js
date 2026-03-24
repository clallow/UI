const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST /api/feedback - 提交反馈
router.post('/', async (req, res) => {
  try {
    const { name, email, content } = req.body;
    
    // 验证数据
    if (!name || !email || !content) {
      return res.status(400).json({ error: '所有字段都是必填的' });
    }
    
    // 创建新反馈
    const feedback = new Feedback({ name, email, content });
    await feedback.save();
    
    res.status(201).json({ message: '反馈提交成功', feedback });
  } catch (error) {
    console.error('提交反馈失败:', error);
    res.status(500).json({ error: '服务器错误，请稍后重试' });
  }
});

// GET /api/feedback - 获取所有反馈
router.get('/', async (req, res) => {
  try {
    // 按时间倒序排列
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('获取反馈失败:', error);
    res.status(500).json({ error: '服务器错误，请稍后重试' });
  }
});

module.exports = router;