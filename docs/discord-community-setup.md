# Discord 社区设置指南

## 🎯 为什么选择 Discord？

✅ **免费** - 无限成员，无限消息历史  
✅ **成熟** - 全球最流行的开发者社区平台  
✅ **功能强大** - 语音频道、屏幕分享、线程讨论  
✅ **易用** - 用户熟悉度高，无需学习成本  
✅ **集成** - 支持 Bot、Webhook、API 集成  

---

## 📋 设置步骤（30 分钟）

### **Step 1: 创建 Discord 服务器**

1. 访问 [Discord](https://discord.com)
2. 登录或注册账号
3. 点击左侧 "+" 按钮
4. 选择 "Create My Own" → "For a club or community"
5. 服务器名称：**GlobalTechEvents Community**
6. 上传服务器图标：使用你的 Logo（`/public/logo-v1.svg`）

---

### **Step 2: 频道设置（推荐结构）**

#### **📢 WELCOME & INFO**
- `#welcome` - 欢迎新成员，介绍社区规则
- `#rules` - 社区规则和行为准则
- `#announcements` - 官方公告（只读）
- `#resources` - 有用的资源链接

#### **💬 GENERAL**
- `#general` - 随意聊天
- `#introductions` - 自我介绍
- `#feedback` - 对网站/社区的反馈

#### **🎯 EVENTS**
- `#event-discovery` - 讨论和分享活动
- `#event-reviews` - 参会后的评价和心得
- `#submit-events` - 用户贡献新活动
- `#find-buddies` - 寻找活动伙伴

#### **🛠️ TECH DISCUSSIONS**
- `#ai-ml` - AI/机器学习讨论
- `#web-dev` - Web 开发
- `#devops-cloud` - DevOps 和云计算
- `#blockchain-web3` - 区块链和 Web3
- `#mobile-dev` - 移动开发
- `#random-tech` - 其他技术话题

#### **🌍 REGIONAL**
- `#north-america`
- `#europe`
- `#asia-pacific`
- `#other-regions`

#### **🎤 VOICE CHANNELS**
- `🔊 Lounge` - 随意聊天
- `🔊 Study Together` - 一起学习/工作
- `🔊 Event Watch Party` - 一起看活动直播

---

### **Step 3: 角色设置**

创建以下角色（角色 → 创建角色）：

#### **管理团队**
- `👑 Owner` - 你（最高权限）
- `🛡️ Admin` - 管理员（管理所有频道）
- `🔧 Moderator` - 版主（删除消息、踢人）

#### **社区成员**
- `⭐ Event Organizer` - 活动组织者（官方认证）
- `🎯 Active Contributor` - 活跃贡献者（提交 10+ 活动）
- `💎 Early Supporter` - 早期支持者（前 100 名成员）
- `👤 Member` - 普通成员（所有人默认）

#### **兴趣标签（可选）**
- `🤖 AI/ML Enthusiast`
- `⚛️ Frontend Developer`
- `⚙️ Backend Developer`
- `📱 Mobile Developer`
- `⛓️ Web3 Builder`

**角色颜色建议：**
- Owner: #FF7A18（橙色，主题色）
- Admin: #FFD8A8（浅黄）
- Moderator: #F2E7FF（浅紫）
- Active Contributor: #06B6D4（青色）

---

### **Step 4: 欢迎消息设置**

在 `#welcome` 频道置顶：

```markdown
# 👋 欢迎来到 GlobalTechEvents 社区！

我们是一个致力于**发现和分享全球科技活动**的社区。

## 🎯 这里可以做什么？

✅ **发现活动** - 分享你感兴趣的科技会议、黑客松、聚会  
✅ **结伴参会** - 找到志同道合的活动伙伴  
✅ **分享心得** - 讨论参会经验和收获  
✅ **技术交流** - 和全球开发者交流技术话题  

## 📜 社区规则

1. **尊重他人** - 友善、包容、礼貌
2. **禁止垃圾信息** - 不发广告、不刷屏
3. **专注主题** - 在对应频道发布内容
4. **保护隐私** - 不泄露他人信息
5. **英文优先** - 主要使用英文，方便全球交流

## 🚀 开始行动

1. 去 #introductions 介绍自己
2. 到 #event-discovery 发现感兴趣的活动
3. 在技术频道参与讨论

有问题？联系 @Admin 或 @Moderator

**让我们一起探索科技的未来！** 🌟
```

---

### **Step 5: 机器人集成（可选但推荐）**

#### **1. MEE6** - 欢迎消息 + 等级系统
- 访问：https://mee6.xyz
- 连接你的 Discord 服务器
- 设置欢迎消息自动发送到 `#welcome`
- 启用等级系统（活跃度排行榜）

#### **2. Dyno** - 自动化管理
- 访问：https://dyno.gg
- 自动删除垃圾信息
- 自动分配角色
- 自定义命令

#### **3. Disboard** - 服务器推广
- 访问：https://disboard.org
- 将你的服务器加入公开列表
- 定期 bump 提高曝光度

---

### **Step 6: 创建邀请链接**

1. 右键点击服务器图标 → "Invite People"
2. 点击 "Edit invite link"
3. 设置：
   - **Expire after:** Never（永不过期）
   - **Max number of uses:** No limit（无限使用）
4. 复制链接：`https://discord.gg/your-invite-code`

**重要：将这个链接更新到代码中！**

打开 `src/App.tsx`，找到：
```typescript
const openDiscord = () => {
  // TODO: 替换为你的 Discord 邀请链接
  window.open('https://discord.gg/your-invite-code', '_blank');
};
```

替换为你的真实链接。

---

### **Step 7: 服务器外观设置**

#### **服务器横幅（Banner）**
- 大小：960x540 px
- 内容：网站 Logo + "Join GlobalTechEvents Community"
- 背景：渐变色（橙-黄-紫，和网站一致）

#### **服务器图标**
- 使用 `/public/logo-v1.svg`
- 建议转换为 512x512 PNG

#### **服务器简介**
```
🌍 Discover, track, and connect at the world's most influential tech events.

From AI summits to developer conferences, hackathons to meetups—join thousands of tech enthusiasts exploring what's next.

🔗 Website: https://globaltechevents.com
```

---

## 📈 社区增长策略

### **第一周：启动阶段**
- ✅ 邀请你的朋友和早期用户
- ✅ 在网站显眼位置添加"Join Discord"按钮
- ✅ 分享到 Twitter, LinkedIn, Product Hunt

### **第一个月：内容建设**
- ✅ 每天分享 2-3 个精选活动
- ✅ 邀请活动组织者加入
- ✅ 举办线上 AMA（Ask Me Anything）

### **长期：社区运营**
- ✅ 定期举办活动（如：周五技术分享）
- ✅ 奖励活跃贡献者（角色、徽章）
- ✅ 建立社区指南和 FAQ
- ✅ 培养核心成员成为版主

---

## 🎯 成功指标

### **短期目标（3 个月）**
- 👥 500+ 成员
- 💬 日均 50+ 消息
- 📅 用户贡献 100+ 活动

### **长期目标（1 年）**
- 👥 5,000+ 成员
- 💬 日均 500+ 消息
- 🌟 成为全球科技活动社区的首选平台

---

## 💰 成本

**完全免费！** 🎉

Discord 服务器和所有推荐的机器人都是免费的。

---

## 🚀 下一步

1. ✅ 创建 Discord 服务器
2. ✅ 设置频道和角色
3. ✅ 创建邀请链接
4. ✅ 更新网站代码中的链接
5. ✅ 发布公告，邀请用户加入
6. ✅ 开始社区运营！

---

## 💡 运营建议

### **保持活跃**
- 每天至少登录一次
- 回复成员的问题和讨论
- 分享有价值的内容

### **建立规则**
- 明确社区价值观
- 一致地执行规则
- 对违规行为及时处理

### **培养文化**
- 鼓励互帮互助
- 表彰优秀贡献者
- 营造包容、友好的氛围

### **持续改进**
- 定期收集成员反馈
- 调整频道结构
- 优化社区规则

---

## 📚 参考资源

- [Discord 服务器设置指南](https://support.discord.com/hc/en-us/articles/206143407)
- [社区管理最佳实践](https://discord.com/community)
- [Discord 机器人列表](https://top.gg/)

---

**准备好建立你的全球科技社区了吗？** 🌟

有问题随时问我！
