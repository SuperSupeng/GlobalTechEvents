# GTE 活动数据自动更新

## 这次做了什么

已建立一条可落地的自动更新链路：

1. `scripts/sync-events.ts`
   - 本地或 CI 可手动执行
   - 支持 `--dry-run`、`--limit=`、`--event-id=`
2. `api/cron/sync-events.ts`
   - 供 Vercel Cron 每天触发
   - 默认写回 Supabase
   - 支持 `?dryRun=true&limit=5` 做抽样检查
3. `api/_lib/event-sync.ts`
   - 从 Supabase 读取活动
   - 优先抓取 `links.source`，没有则回退到 `links.officialSite`
   - 尝试从活动官网 JSON-LD 中提取 Event 结构化数据
   - 自动刷新：
     - `status`（upcoming/live/ended）
     - `start_time`
     - `end_time`
     - `location`
     - `links.officialSite`
     - `links.registration`

## 设计原则

不是一步到位做“全网抓取器”，而是先把当前 80+ 条已有人肉录入的活动，升级成“每天自动复核一次”的系统。

这版的现实收益：
- 已有活动不会一直停留在旧状态
- 官网若提供标准 Event schema，可自动回填日期/注册链接
- 失败会体现在 cron/API 输出里，方便后续补强

## 环境变量

至少需要以下变量：

### 只读 / dry-run
- `VITE_SUPABASE_URL` 或 `SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` 或 `SUPABASE_PUBLISHABLE_KEY`

### 写回 Supabase
- `SUPABASE_SERVICE_ROLE_KEY`

### 保护 cron endpoint
- `CRON_SECRET`（推荐；手动调用 API 时使用）

## 推荐命令

### 本地演练

```bash
npm run sync:events:dry
npm run sync:events:dry -- --limit=5
npm run sync:events -- --limit=10
```

### 手动触发线上 cron

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  "https://www.globaltechevents.xyz/api/cron/sync-events?dryRun=true&limit=5"
```

## Vercel Cron

已在 `vercel.json` 配置：
- 每天 UTC 06:00 执行一次 `/api/cron/sync-events`

如需改成北京时间上午 10 点，可改为：
- `0 2 * * *`

## 现阶段限制

1. 只对“官网带 JSON-LD Event 结构化数据”的页面最有效
2. 对纯 JS 渲染、无 schema、反爬严格的网站，暂时只能做状态刷新和抓取失败记录
3. 当前没有把同步结果单独落库，先以 API 返回和 Vercel 日志为准

## 下一步建议

1. 给高价值活动补齐 `links.source` 为真实活动详情页，不要只留品牌首页
2. 增加 `event_sync_runs` 表，沉淀每日同步审计日志
3. 针对占比最高的来源（如 Luma / Eventbrite / 官方会议信息页）做专用解析器，提高更新命中率
