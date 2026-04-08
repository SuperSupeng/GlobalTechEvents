# Global Tech Events (GTE)

> 全球科技活动聚合网站 - 一站式发现值得参加的科技活动

**线上地址**：https://globaltechevents.xyz  
**状态**：✅ MVP 已上线（2026-04-06）

---

## 项目定位

Global Tech Events 解决「活动信息分散、发现成本高」的问题：

- 科技活动分散在 Meetup、Eventbrite、Luma、社区官网等多个平台
- 用户需要跨平台搜索，容易错过高质量活动
- 缺少按城市、类型、时间统一筛选与规划的入口

GTE 提供聚合式活动发现体验，支持按城市、时间和活动类型浏览，帮助用户更高效地连接线下科技社区。

---

## 目标用户

- **Founder / Builder**：拓展行业网络、追踪前沿趋势
- **数字游民**：到新城市后快速融入本地技术社区
- **远程工作者**：通过线下活动建立真实连接、减少孤立感

---

## 核心价值

1. **省时间**：聚合多个来源，减少跨平台检索成本
2. **不错过**：集中展示即将发生的重要活动
3. **可规划**：按城市和时间维度安排参与节奏

---

## 当前功能（MVP）

- 活动列表浏览
- 活动详情查看
- 基础筛选与检索
- 线上部署（Vercel）

后续将逐步完善：数据更新频率、SEO 页面、增长分发与订阅能力。

---

## 技术栈

- React + TypeScript + Vite
- Tailwind CSS
- Supabase
- Vercel

---

## 本地开发

```bash
npm install
npm run dev
```

常用命令：

```bash
npm run build    # 生产构建
npm run preview  # 本地预览构建结果
npm run lint     # 代码检查
npm run migrate  # 数据迁移脚本（需 .env.local）
```

---

## 项目结构（简要）

- `src/`：前端应用
- `api/`：服务端 API（Vercel Functions）
- `database/`：数据结构与脚本
- `docs/`：项目文档

---

## 相关文档

- 产品定位参考：`/home/admin/Nutstore Files/Knowledge-Database/4. Projects/globaltechevents/README.md`
- 项目需求文档：`PRD.md`
