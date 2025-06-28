# LittleExpress - Node.js Express API 项目

## 项目概述
这是一个基于Node.js和Express框架构建的RESTful API项目，实现了完整的用户管理系统，包括用户注册、登录、信息管理等功能。

## 技术栈
- **运行时**: Node.js
- **框架**: Express
- **数据库**: MySQL
- **认证**: JWT
- **日志**: Winston + Morgan
- **API文档**: Swagger UI
- **测试**: Jest
- **代码质量**: ESLint + Prettier
- **语言**: TypeScript

## 功能特性
- 用户注册与登录
- JWT认证
- 用户信息管理
- 密码加密存储
- 完善的API文档
- 请求验证
- 错误处理中间件
- 安全防护(Helmet, Rate Limiting)
- 日志记录

## 项目结构
```
src/
├── app.ts            # Express应用配置
├── index.ts          # 应用入口
├── server.ts         # HTTP服务器
├── config/           # 配置模块
│   ├── database.ts   # 数据库配置
│   ├── env.ts        # 环境变量
│   ├── server.ts     # 服务器配置
│   └── swagger.ts    # Swagger配置
├── controllers/      # 控制器层
│   └── user.controller.ts
├── models/           # 数据模型层
│   └── user.model.ts
├── routes/           # 路由定义
│   └── user.routes.ts
├── services/         # 业务逻辑层
│   └── user.service.ts
├── middlewares/      # 中间件
│   ├── auth.ts       # 认证中间件
│   ├── errorHandler.ts
│   └── validateRequest.ts
├── types/            # 类型定义
│   └── express.d.ts
└── utils/            # 工具函数
    ├── ApiError.ts
    └── logger.ts
```

## 环境要求
- Node.js 16+
- MySQL 8+
- npm 8+

## 安装与运行
1. 克隆仓库
```bash
git clone <repository-url>
cd littleExpress
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
复制.env.example为.env并填写实际值
```bash
cp .env.example .env
```

4. 启动开发服务器
```bash
npm run dev
```

5. 访问API文档
http://localhost:3000/api-docs

## API文档
项目使用Swagger UI提供交互式API文档，启动后访问 `/api-docs` 即可查看。

## 测试
运行单元测试：
```bash
npm test
```

## 贡献指南
1. Fork项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

## 许可证
[MIT](LICENSE)