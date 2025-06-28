const express = require('express');
const usersRoutes = require('./user.routes'); 

const router = express.Router();

// 注册用户路由
router.use('/users', usersRoutes);
 
// 可以在这里添加更多路由
// router.use('/products', productsRoutes);
// router.use('/orders', ordersRoutes);

module.exports = router;