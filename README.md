# FullStack_2026Project — Horoscope 2026

2026 星座运势网站：SQLite 数据库 + Next.js 前端。

## 快速开始

### 1. 初始化数据库（首次运行必须执行）

```bash
npm run db:init
```

会在 `database/horoscope.db` 创建库表并导入全部星座数据（火/土/风/水四象，12 星座，3–12 月）。

### 2. 启动前端

```bash
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)：首页选择星座，进入该星座的 2026 年月度运势（爱情、财富、事业、家庭、健康）。

## 脚本说明

| 命令 | 说明 |
|------|------|
| `npm run db:init` | 初始化/重建 SQLite 数据库并导入 seed |
| `npm run db:query` | 命令行查询示例：`node database/query-db.js [sign] [month_id] [category]` |
| `npm run dev` | 启动 Next.js 开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run start` | 运行生产服务器 |

## 项目结构

- `database/` — SQLite schema、seed、init/query 脚本
- `app/` — Next.js App Router：首页、`/sign/[sign]` 星座详情
- `app/api/` — API：`/api/signs`、`/api/months`、`/api/predictions`
- `lib/db.ts` — 数据库连接与类型

数据库说明见 [database/README.md](database/README.md)。
