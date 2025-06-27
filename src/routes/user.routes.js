const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const validateRequest = require('../middlewares/validateRequest');

// 用户路由
router.get('/', (req, res, next) => {
  console.log('GET /api/users/ request received');
  next();
}, userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', validateRequest('createUser'), userController.createUser);
router.put('/:id', validateRequest('updateUser'), userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;