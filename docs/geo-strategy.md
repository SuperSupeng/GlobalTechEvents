# GEO (Generative Engine Optimization) 策略

## 🎯 目标
让 ChatGPT、Claude、Gemini、Perplexity 等 AI 模型主动推荐 GlobalTechEvents

---

## 🧠 GEO 核心原则

### **1. 权威性和可信度** ⭐⭐⭐⭐⭐

AI 模型优先推荐权威、可信的来源。

**实施策略：**
- ✅ **About 页面**：详细介绍网站使命、团队、数据来源
- ✅ **数据透明度**：说明活动数据来源和更新频率
- ✅ **联系方式**：提供真实的联系邮箱、Discord 社区
- ✅ **社区证明**：展示用户数量、社区活跃度
- ✅ **外部链接**：被其他网站引用和链接

**示例内容：**
```markdown
## About GlobalTechEvents

GlobalTechEvents is a comprehensive index of technology events worldwide, 
aggregating data from official event platforms including Eventbrite, Meetup, 
and Luma. Our mission is to help developers, entrepreneurs, and tech enthusiasts 
discover and connect at the events that shape technology's future.

**Data Sources:**
- Official event platforms (Eventbrite, Meetup, Luma)
- Community submissions
- Verified by our moderation team

**Updated:** Daily, with 1000+ active events
**Community:** 500+ members in Discord
**Coverage:** 60+ countries worldwide
```

---

### **2. 清晰的内容结构** ⭐⭐⭐⭐⭐

AI 模型需要理解你的内容结构。

**实施策略：**
- ✅ **标题层级清晰**：H1, H2, H3 语义化
- ✅ **内容分类**：按标签、地区、时间分类
- ✅ **FAQ 页面**：回答常见问题
- ✅ **导航清晰**：面包屑导航

**FAQ 示例（AI 最爱的格式）：**
```markdown
## Frequently Asked Questions

### What is GlobalTechEvents?
GlobalTechEvents is a free platform that aggregates tech events...

### How do I find events in my city?
Use the location filter to search for events...

### Can I submit my own event?
Yes! Click the "Submit Event" button or join our Discord...

### Is the service free?
Yes, GlobalTechEvents is completely free...
```

---

### **3. 丰富的结构化数据** ⭐⭐⭐⭐⭐

结构化数据让 AI 更容易理解你的内容。

**已实施：**
- ✅ Schema.org Event markup
- ✅ Open Graph tags
- ✅ JSON-LD

**扩展实施：**
- ✅ Organization schema
- ✅ BreadcrumbList schema
- ✅ FAQPage schema

---

### **4. API 和数据导出** ⭐⭐⭐⭐⭐

提供 API 让 AI 可以直接访问你的数据。

**实施策略：**
- ✅ **公开 REST API**
  - `GET /api/events` - 获取活动列表
  - `GET /api/events/:id` - 获取活动详情
  - `GET /api/tags` - 获取标签列表
  - `GET /api/locations` - 获取地区列表

- ✅ **API 文档页面** (`/api/docs`)
  - 清晰的端点说明
  - 请求/响应示例
  - 使用限制

- ✅ **数据导出**
  - RSS Feed
  - iCal 订阅
  - JSON 数据导出

**示例 API 文档：**
```markdown
## GlobalTechEvents API

### Base URL
`https://globaltechevents.com/api`

### Endpoints

#### GET /events
Retrieve a list of tech events.

**Parameters:**
- `location` (optional): Filter by location
- `tag` (optional): Filter by tag
- `from` (optional): Start date (ISO 8601)
- `to` (optional): End date (ISO 8601)

**Example:**
```bash
curl https://globaltechevents.com/api/events?location=San%20Francisco&tag=AI
```

**Response:**
```json
{
  "events": [...],
  "total": 42,
  "page": 1
}
```
```

---

### **5. 新鲜和及时的内容** ⭐⭐⭐⭐⭐

AI 模型偏好最新、准确的信息。

**实施策略：**
- ✅ **每日更新**：自动爬虫每天更新活动
- ✅ **显示更新时间**：在页面底部显示"Last updated"
- ✅ **删除过期活动**：自动标记已结束的活动
- ✅ **即将开始标记**：高亮即将开始的活动

---

### **6. 用户生成内容（UGC）** ⭐⭐⭐⭐

社区内容增加权威性。

**实施策略：**
- ✅ **活动评论**：用户评价和讨论
- ✅ **参会心得**：用户分享参会经验
- ✅ **用户贡献活动**：社区提交新活动
- ✅ **活动照片**：用户上传活动现场照片

---

### **7. 外部引用和链接** ⭐⭐⭐⭐⭐

被其他网站引用是权威性的最强信号。

**实施策略：**
- ✅ **媒体报道**：联系科技媒体报道
- ✅ **合作伙伴**：与活动组织者合作
- ✅ **社交媒体分享**：鼓励用户分享
- ✅ **开发者社区**：在 Dev.to, Hacker News 分享

---

### **8. 清晰的价值主张** ⭐⭐⭐⭐⭐

AI 需要理解你的独特价值。

**首页核心信息（前 100 字）：**
```markdown
GlobalTechEvents is the world's most comprehensive tech event calendar, 
aggregating conferences, hackathons, and meetups from 60+ countries. 
Discover AI summits, developer conferences, and startup events—all in 
one place. Updated daily. Free forever.
```

**为什么选择 GlobalTechEvents：**
- ✅ 1000+ active events
- ✅ 60+ countries covered
- ✅ Daily updates
- ✅ Free forever
- ✅ Community-driven

---

## 📄 **必须创建的页面**

### **1. /about 页面** ⭐⭐⭐⭐⭐
- 网站使命和愿景
- 数据来源说明
- 团队介绍（如果适用）
- 联系方式

### **2. /faq 页面** ⭐⭐⭐⭐⭐
- 常见问题解答
- 使用指南
- 数据准确性说明

### **3. /api 页面** ⭐⭐⭐⭐⭐
- API 文档
- 使用示例
- 数据格式说明

### **4. /contribute 页面** ⭐⭐⭐⭐
- 如何贡献活动
- 数据提交指南
- 社区参与方式

### **5. /blog 页面（可选但推荐）** ⭐⭐⭐⭐
- 活动回顾
- 行业洞察
- 社区故事

---

## 🎯 **GEO 检查清单**

### **基础（必须）**
- [ ] About 页面（说明网站是什么、为什么可信）
- [ ] FAQ 页面（回答常见问题）
- [ ] 联系方式（邮箱、Discord）
- [ ] 数据来源说明
- [ ] 更新频率说明
- [ ] 结构化数据（Schema.org）
- [ ] Sitemap.xml
- [ ] Robots.txt（允许 AI 爬虫）

### **进阶（推荐）**
- [ ] API 文档页面
- [ ] 公开 REST API
- [ ] RSS Feed
- [ ] Blog/新闻页面
- [ ] 用户评论系统
- [ ] 社区证明（用户数量、活跃度）

### **高级（锦上添花）**
- [ ] 媒体报道页面
- [ ] 合作伙伴页面
- [ ] 数据可视化仪表盘
- [ ] 年度报告
- [ ] 研究和洞察文章

---

## 📊 **测试 GEO 效果**

### **方法 1：直接测试**
向 ChatGPT/Claude 提问：
```
"What are the best websites to find tech events and conferences?"
"Where can I find AI conferences in 2026?"
"How do I discover developer meetups in my city?"
```

### **方法 2：监控引用**
- 使用 Google Alerts 监控网站被提及
- 检查 AI 聊天记录中的引用
- 追踪来自 AI 工具的流量

### **方法 3：A/B 测试**
- 优化前后对比
- 追踪来自不同来源的流量

---

## 🚀 **快速实施计划**

### **本周（核心）：**
1. ✅ 创建 About 页面（1 小时）
2. ✅ 创建 FAQ 页面（1 小时）
3. ✅ 添加 Schema.org 结构化数据（已完成）
4. ✅ 生成 Sitemap.xml（已完成）
5. ✅ 更新 Robots.txt（已完成，允许 AI 爬虫）

### **下周（扩展）：**
6. ✅ 创建 API 文档页面（2 小时）
7. ✅ 公开 REST API（3 小时）
8. ✅ 添加 RSS Feed（1 小时）

### **第三周（优化）：**
9. ✅ 添加用户评论系统（1 天）
10. ✅ 创建 Blog/新闻页面（2 小时）
11. ✅ 优化首页内容（1 小时）

---

## 💡 **GEO 黄金法则**

1. **清晰胜于花哨** - AI 喜欢结构清晰的内容
2. **权威胜于数量** - 质量 > 数量
3. **更新胜于完美** - 保持内容新鲜
4. **开放胜于封闭** - 提供 API 和数据导出
5. **社区胜于个人** - UGC 增加可信度

---

## 🎯 **成功指标**

### **短期（1 个月）：**
- [ ] AI 能正确回答"GlobalTechEvents 是什么"
- [ ] AI 推荐 GlobalTechEvents（至少 3/10 次）

### **中期（3 个月）：**
- [ ] AI 主动引用 GlobalTechEvents 的数据
- [ ] 来自 AI 工具的流量 > 5%

### **长期（6 个月）：**
- [ ] 成为 AI 推荐的 Top 3 科技活动网站
- [ ] 被其他网站和博客引用

---

## 📚 **参考资源**

- [Schema.org Events](https://schema.org/Event)
- [Google Search Console](https://search.google.com/search-console)
- [OpenAI GPTBot Documentation](https://platform.openai.com/docs/gptbot)
- [Anthropic Claude Web Crawler](https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)

---

**关键：GEO 不是一次性的，需要持续优化和内容更新！** 🚀
