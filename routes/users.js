const express = require('express');
const router = express.Router();

// 模拟用户数据
const users = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' }
];

// 获取所有用户
router.get('/', (req, res) => {
  res.json(users);
});

// 获取单个用户
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: '用户未找到' });
  res.json(user);
});

// 创建用户
router.post('/', (req, res) => {
  const user = {
    id: users.length + 1,
    name: req.body.name
  };
  users.push(user);
  res.status(201).json(user);
});

module.exports = router;