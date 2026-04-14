# Global Tech Events (GTE)

> 全球科技活动聚合网站 - 一站式发现值得参加的科技活动

线上地址：https://globaltechevents.xyz
状态：✅ MVP 已上线（2026-04-06）

---

## 项目定位

Global Tech Events 解决「活动信息分散、发现成本高」的问题：

- 科技活动分散在 Meetup、Eventbrite、Luma、社区官网等多个平台
- 用户需要跨平台搜索，容易错过高质量活动
- 缺少按城市、类型、时间统一筛选与规划的入口

GTE 提供聚合式活动发现体验，支持按城市、时间和活动类型浏览，帮助用户更高效地连接线下科技社区。

---

## 目标用户

- Founder / Builder：拓展行业网络、追踪前沿趋势
- 数字游民：到新城市后快速融入本地技术社区
- 远程工作者：通过线下活动建立真实连接、减少孤立感

---

## 当前功能（MVP）

- 活动列表浏览
- 活动详情查看
- 基础筛选与检索
- 线上部署（Vercel）
- Events Hub 最小转化闭环：newsletter signup / submit event / outbound click

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
npm run build            # 生产构建
npm run preview          # 本地预览构建结果
npm run lint             # 代码检查
npm run migrate          # 数据迁移脚本（需 .env.local）
npm run sync:events:dry  # 活动数据自动更新 dry-run
npm run sync:events      # 活动数据自动更新并写回 Supabase
```

---

## Analytics / SEO 最小数据闭环配置

### 前端环境变量（Vercel Project Env 或本地 `.env.local`）

```bash
GOOGLE_SITE_VERIFICATION=...        # 可选；有值才注入 google-site-verification meta
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX # 可选；有值才加载 gtag.js 并发送 GA4 custom events
# 兼容旧命名，也支持：GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SUPABASE_URL=https://xxx.supabase.co
```

说明：
- Vercel Analytics 已通过 `<Analytics />` 加载；custom event 由 `src/utils/analytics.ts` 统一发送。
- GA4 没有 measurement id 时自动 no-op，不会报错。
- GSC verification 没有值时不渲染 meta。

### 服务端环境变量（Vercel Functions）

```bash
SUPABASE_SERVICE_ROLE_KEY=...
# 可选兼容：如果服务端不读 VITE_SUPABASE_URL，可额外设置 SUPABASE_URL
SUPABASE_URL=https://xxx.supabase.co
CRON_SECRET=...                    # 推荐；手动触发 /api/cron/sync-events 时使用
```

说明：
- `api/newsletter-signups.ts`：真实保存 newsletter signup 成功态后，前端才触发 `newsletter_signup`。
- `api/event-submissions.ts`：真实保存 submit event 成功态后，前端才触发 `submit_event`。
- `api/cron/sync-events.ts`：每日自动复核活动数据，优先使用 `links.source`，没有则回退到 `links.officialSite`。
- 没有 Supabase 配置时 API 会返回 503，避免把 click intent 伪装成 success。

### Supabase schema

在 Supabase SQL Editor 执行：

```sql
-- 使用仓库中的最新 schema
-- /database/schema.sql
```

新增表：
- `newsletter_signups`
- `event_submissions`

### 已接入的最小事件

- `outbound_click`
  - Event detail modal: Official Website
  - SEO event page: Official Website / Registration
  - Events Hub: Join WhatsApp / Top event Official Website
  - Home / Footer WhatsApp CTA
- `newsletter_signup`
  - Events Hub newsletter form 保存成功后触发
- `submit_event`
  - Events Hub submit event form 保存成功后触发

默认参数：
- `source_page`
- `page_type`
- `target_url`
- `target_domain`
- `event_slug`
- `cta_label`

注意：`Copy Link` 不计为 outbound_click。

---

## 部署后验证

1. 在 Vercel Production 环境确认以下变量已设置：
   - `GOOGLE_SITE_VERIFICATION`（可选）
   - `VITE_GA_MEASUREMENT_ID` 或 `GA_MEASUREMENT_ID`（可选）
   - `VITE_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
2. 执行 `/database/schema.sql` 到生产 Supabase。
3. 访问 `/events`：
   - 提交 newsletter form，确认接口 200，Supabase `newsletter_signups` 出现新行。
   - 提交 submit event form，确认接口 200，Supabase `event_submissions` 出现新行。
   - 点击 WhatsApp / Official Website，确认 Vercel Analytics 的 custom event 出现 `outbound_click`。
4. 若配置了 GA4：
   - 打开 GA4 DebugView，检查 `outbound_click` / `newsletter_signup` / `submit_event` 是否到达。
5. 若配置了 GSC：
   - 页面源代码或 Elements 中确认存在 `meta[name="google-site-verification"]`。
   - 在 GSC 完成域名/URL prefix 验证并等待收录数据写入。

---

## 第一版真实数据时效预估

- Vercel Analytics：部署后几分钟内可看到实时/近实时事件。
- GA4 DebugView：通常 1-5 分钟内可见。
- GA4 标准报表：通常数小时内开始稳定。
- GSC Search results / Pages：通常 24-72 小时起有首批 impressions / clicks / CTR（取决于抓取和收录节奏）。

---

## 项目结构（简要）

- `src/`：前端应用
- `api/`：服务端 API（Vercel Functions）
- `database/`：数据结构与脚本
- `docs/`：项目文档

---

## 相关文档

- 活动数据自动更新：`docs/event-sync.md`
- 产品定位参考：`/home/admin/Nutstore Files/Knowledge-Database/4. Projects/globaltechevents/README.md`
- 项目需求文档：`PRD.md`
