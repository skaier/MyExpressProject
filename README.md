# MyExpressProject

一个基于 Express + TypeScript 构建的轻量级后端框架，提供完整的用户管理系统和 API 文档。

## 特性

- 🚀 基于 Express.js 和 TypeScript
- 📚 Swagger API 文档自动生成
- 🔐 用户认证和授权
- 📝 完整的用户管理 CRUD 操作
- 🎯 请求验证和错误处理
- 📊 MySQL 数据库集成
- 🔍 分页查询支持
- 📋 日志记录
- 🛡️ 安全性配置 (Helmet, CORS, Rate Limiting)

## 技术栈

- Express.js
- TypeScript
- MySQL
- Swagger (API 文档)
- Winston (日志)
- Helmet (安全)
- JWT (认证)

## 项目结构

```
src/
├── config/         # 配置文件
├── constants/      # 常量定义
├── controllers/    # 控制器
├── interfaces/     # 接口定义
├── middlewares/    # 中间件
├── models/         # 数据模型
├── routes/         # 路由
├── services/       # 业务逻辑
├── swagger/        # Swagger 配置
├── types/          # 类型定义
├── utils/          # 工具函数
├── app.ts          # Express 应用配置
└── server.ts       # 服务器入口
```

## 功能特性

### 用户管理

- 用户注册
- 用户登录
- 获取用户信息
- 更新用户信息
- 删除用户
- 用户列表（支持分页）

### API 安全

- JWT 认证
- 请求速率限制
- 安全 HTTP 头
- CORS 配置
- 密码加密

### 数据库

- MySQL 连接池
- 事务支持
- 查询构建
- 错误处理

### 其他特性

- 环境变量配置
- 日志记录
- 请求验证
- 错误处理中间件
- API 响应标准化

## 快速开始

1. 克隆项目

```bash
git clone [repository-url]
cd MyExpressProject
```

2. 安装依赖

```bash
npm install
```

3. 配置环境变量

复制 `.env.example` 文件到 `.env` 并配置必要的环境变量：

```env
PORT=3000
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
JWT_SECRET=your_jwt_secret
```

4. 创建数据库表

执行 `user_table_ddl.sql` 文件创建必要的数据库表。

5. 启动开发服务器

```bash
npm run dev
```

6. 构建生产版本

```bash
npm run build
```

7. 启动生产服务器

```bash
npm start
```

## API 文档

启动服务器后，访问 `http://localhost:3000/api-docs` 查看 Swagger API 文档。

## 开发

### 可用的 npm 脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm start` - 运行生产版本
- `npm run lint` - 运行 ESLint 检查
- `npm run format` - 格式化代码

### 目录说明

- `config/` - 包含所有配置文件
- `controllers/` - 处理 HTTP 请求和响应
- `models/` - 数据库模型和查询
- `services/` - 业务逻辑
- `middlewares/` - Express 中间件
- `utils/` - 工具函数和辅助方法

## 许可证

[MIT](LICENSE)