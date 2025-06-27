# Express Demo API

一个基于Node.js和Express的RESTful API模板项目。

## 项目结构

```
src/
├── config/
│   ├── db.js        # 数据库连接配置
│   ├── env.js       # 环境变量验证
│   └── server.js    # Express服务器配置
├── controllers/     # 业务控制器
├── middlewares/     # 自定义中间件
├── models/          # 数据库模型
├── routes/          # API路由
├── services/        # 业务逻辑
├── utils/           # 工具函数
│   └── logger.js    # 日志配置
├── app.js           # Express应用配置
└── index.js         # 应用入口
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

创建 `.env` 文件：

```env
MONGODB_URI=mongodb://localhost:27017/yourdb
JWT_SECRET=your_jwt_secret
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

### 3. 启动应用

```bash
node src/index.js
```

应用启动后将在控制台显示运行端口和环境信息。

## 功能特性

- 模块化配置管理
- 环境变量验证
- 请求日志记录
- 安全中间件(Helmet, CORS)
- 速率限制
- 结构化日志(Winston)

## 开发

### 日志配置

日志文件存储在 `logs/` 目录下：

- `error.log` - 错误日志
- `combined.log` - 综合日志
- `exceptions.log` - 未捕获异常

### 测试

```bash
npm test
```

## 部署

设置生产环境变量：

```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
```

## 依赖

- Express
- Mongoose
- Winston
- Helmet
- CORS
- Morgan(开发环境)