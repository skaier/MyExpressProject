# LittleExpress API

一个基于Node.js和Express的高性能RESTful API服务，支持MySQL数据库。

## 技术栈

- **运行时**: Node.js
- **框架**: Express
- **数据库**: MySQL
- **安全**: JWT认证, Helmet, CORS, 速率限制
- **日志**: Winston + Morgan
- **文档**: Swagger UI

## 项目结构

```
src/
├── config/          # 配置管理
│   ├── db.js        # 数据库连接配置
│   ├── env.js       # 环境变量验证
│   ├── server.js    # Express服务器配置
│   └── swagger.js   # API文档配置
├── controllers/     # 业务控制器
├── middlewares/     # 自定义中间件
│   ├── auth.js      # 认证中间件
│   ├── errorHandler.js # 错误处理
│   └── validateRequest.js # 请求验证
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

复制 `.env.example` 为 `.env` 并修改配置：

```env
# 基础配置
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# MySQL配置
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_DATABASE=yourdb

# MongoDB配置 (可选)
MONGODB_URI=mongodb://localhost:27017/yourdb

# JWT配置
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

### 3. 启动应用

```bash
node src/index.js
```

应用启动后将在控制台显示运行端口和环境信息。

## API文档

项目集成了Swagger UI文档，启动服务后访问：

```
http://localhost:3000/api-docs
```

## 功能特性

- **安全防护**:
  - Helmet安全头
  - CORS配置
  - 请求速率限制(15分钟100次)
  - JWT认证
  
- **日志系统**:
  - 请求日志(Morgan)
  - 结构化日志(Winston)
  - 错误追踪
  
- **开发友好**:
  - 环境变量验证
  - 统一错误处理
  - API文档自动生成
  - 健康检查端点(/health)

## 开发指南

### 日志配置

日志文件存储在 `logs/` 目录下：

- `error.log` - 错误日志
- `combined.log` - 综合日志
- `exceptions.log` - 未捕获异常

日志级别可通过 `LOG_LEVEL` 环境变量配置。

### 数据库迁移

SQL表结构定义见 `user_table_ddl.sql`。

### 测试

```bash
npm test
```

## 部署指南

1. 设置生产环境变量：

```env
NODE_ENV=production
MYSQL_HOST=your_production_host
MYSQL_PASSWORD=your_production_password
```

2. 建议使用PM2进程管理：

```bash
npm install -g pm2
pm2 start src/index.js --name "little-express"
```

3. 配置Nginx反向代理(可选)

## 依赖

- **核心**: express, mysql2
- **安全**: helmet, cors, express-rate-limit, bcrypt, jsonwebtoken
- **工具**: winston, morgan, swagger-ui-express