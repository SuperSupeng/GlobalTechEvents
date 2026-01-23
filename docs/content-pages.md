# 必须创建的内容页面

## 🎯 优先级 1：核心页面（本周完成）

### 1. About 页面 (`/about`)

```markdown
# About GlobalTechEvents

## Our Mission
GlobalTechEvents is the world's most comprehensive technology event calendar, 
helping developers, entrepreneurs, and tech enthusiasts discover conferences, 
hackathons, and meetups that shape technology's future.

## What We Do
We aggregate tech events from 60+ countries, including:
- Developer conferences (React Summit, KubeCon, AWS re:Invent)
- AI & ML summits (NeurIPS, ICML, AI Conference)
- Hackathons and startup events
- Tech meetups and community gatherings
- Online workshops and webinars

## Our Data Sources
- **Official Platforms:** Eventbrite, Meetup, Luma, Lu.ma
- **Community Submissions:** User-contributed events
- **Partner Organizations:** Direct partnerships with event organizers
- **Verification:** All events are reviewed by our moderation team

## Key Statistics
- **1,000+ Active Events**
- **60+ Countries** covered worldwide
- **Daily Updates** - New events added every day
- **100% Free** - No hidden fees, forever
- **500+ Community Members** in Discord

## Contact Us
- 📧 Email: hello@globaltechevents.com
- 💬 Discord: https://discord.gg/Cj7s7nt7
- 🐦 Twitter: @GlobalTechEvents (coming soon)

## Last Updated
This page was last updated on January 23, 2026.
Data is refreshed daily at 00:00 UTC.
```

---

### 2. FAQ 页面 (`/faq`)

```markdown
# Frequently Asked Questions

## General

### What is GlobalTechEvents?
GlobalTechEvents is a free platform that aggregates technology events from around 
the world, including conferences, hackathons, meetups, and online workshops.

### Is GlobalTechEvents free?
Yes! GlobalTechEvents is 100% free to use. No registration required, no hidden fees.

### How often is the data updated?
Our database is updated daily. New events are added automatically through our 
data aggregation system, and community submissions are reviewed within 24-48 hours.

### How many events do you have?
We currently index 1,000+ active events across 60+ countries. Our database grows 
daily as new events are announced.

## Using the Platform

### How do I find events in my city?
1. Click the "Location" filter
2. Search for your city or select your region
3. Browse events in your area

### Can I filter events by topic?
Yes! Use the tag filters to find events by technology (AI, React, DevOps, etc.).

### How do I add events to my calendar?
Click on any event and use the "Add to Calendar" button to export to Google Calendar, 
Apple Calendar, or Outlook.

### Can I bookmark events?
Yes! Click the heart icon (❤️) on any event to save it to your favorites. 
Your bookmarks are stored locally in your browser.

## Contributing

### Can I submit my own event?
Absolutely! We welcome community submissions. Click "Submit Event" in the navigation 
or join our Discord community to share events.

### How long does it take to review submitted events?
Most submissions are reviewed within 24-48 hours. You'll receive confirmation via 
the email you provided.

### What information do I need to submit an event?
- Event name and description
- Start and end dates
- Location (or indicate if it's online)
- Registration link
- Event category/tags

## Data & Privacy

### Where does your data come from?
We aggregate data from official event platforms (Eventbrite, Meetup, Luma) and 
accept community submissions. All data is publicly available information.

### Do you collect personal data?
No. GlobalTechEvents does not require login or collect personal information. 
Bookmarks and preferences are stored locally in your browser.

### Can I trust the event information?
We make every effort to ensure accuracy, but we recommend verifying details on 
the official event website before attending.

## Technical

### Do you have an API?
Yes! Check out our API documentation at /api/docs for programmatic access to our event data.

### Can I use your data for my project?
Our data is available via API for non-commercial use. Contact us for commercial licensing.

### Do you have an RSS feed?
Yes! Subscribe to our RSS feed at /feed.xml to get notified of new events.

## Still have questions?
Join our Discord community or email us at hello@globaltechevents.com
```

---

### 3. API 文档页面 (`/api/docs`)

```markdown
# GlobalTechEvents API Documentation

## Overview
The GlobalTechEvents API provides programmatic access to our comprehensive 
database of technology events worldwide.

**Base URL:** `https://globaltechevents.com/api`

**Rate Limits:** 100 requests per hour (subject to change)

**Authentication:** No authentication required for public endpoints

---

## Endpoints

### GET /events
Retrieve a list of tech events.

**Parameters:**
- `location` (string, optional): Filter by location (e.g., "San Francisco")
- `tag` (string, optional): Filter by tag (e.g., "AI", "React")
- `format` (string, optional): Filter by format ("online", "offline", "hybrid")
- `from` (string, optional): Start date in ISO 8601 format
- `to` (string, optional): End date in ISO 8601 format
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Results per page (default: 20, max: 100)

**Example Request:**
```bash
curl "https://globaltechevents.com/api/events?location=San%20Francisco&tag=AI&limit=10"
```

**Response:**
```json
{
  "events": [
    {
      "id": "evt_123abc",
      "title": "AI Summit 2026",
      "summary": "The world's leading AI conference...",
      "startTime": "2026-06-15T09:00:00Z",
      "endTime": "2026-06-17T18:00:00Z",
      "timezone": "America/Los_Angeles",
      "format": "hybrid",
      "location": {
        "city": "San Francisco",
        "country": "United States"
      },
      "tags": ["AI", "Machine Learning", "Deep Learning"],
      "links": {
        "officialSite": "https://aisummit.com"
      },
      "price": {
        "type": "paid",
        "range": "$500 - $1,200"
      }
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

---

### GET /events/:id
Retrieve a specific event by ID.

**Example Request:**
```bash
curl "https://globaltechevents.com/api/events/evt_123abc"
```

**Response:**
```json
{
  "id": "evt_123abc",
  "title": "AI Summit 2026",
  ...
}
```

---

### GET /tags
Retrieve all available tags.

**Example Request:**
```bash
curl "https://globaltechevents.com/api/tags"
```

**Response:**
```json
{
  "tags": [
    { "name": "AI", "count": 245 },
    { "name": "React", "count": 189 },
    { "name": "DevOps", "count": 156 }
  ]
}
```

---

### GET /locations
Retrieve all available locations.

**Example Request:**
```bash
curl "https://globaltechevents.com/api/locations"
```

**Response:**
```json
{
  "locations": [
    { "name": "San Francisco, United States", "count": 128 },
    { "name": "London, United Kingdom", "count": 95 },
    { "name": "Berlin, Germany", "count": 87 }
  ]
}
```

---

## Data Formats

### Event Object
```typescript
interface TechEvent {
  id: string;
  title: string;
  summary: string;
  startTime: string;  // ISO 8601
  endTime: string;    // ISO 8601
  timezone: string;   // IANA timezone
  format: 'online' | 'offline' | 'hybrid';
  location?: {
    city: string;
    country: string;
    address?: string;
  };
  tags: string[];
  language: string[];
  links: {
    officialSite: string;
    registration?: string;
  };
  price: {
    type: 'free' | 'paid' | 'unknown';
    range?: string;
  };
}
```

---

## RSS Feed
Subscribe to new events via RSS:
```
https://globaltechevents.com/feed.xml
```

---

## Terms of Use
- ✅ Free for non-commercial use
- ✅ Attribution required
- ❌ No reselling of data
- ❌ No excessive scraping (respect rate limits)

For commercial licensing, contact hello@globaltechevents.com

---

## Support
Questions? Join our Discord or email api@globaltechevents.com
```

---

## 📝 实施清单

### 页面创建
- [ ] Create `/pages/about.tsx` or `/about.html`
- [ ] Create `/pages/faq.tsx` or `/faq.html`
- [ ] Create `/pages/api-docs.tsx` or `/api/docs.html`
- [ ] Update navigation to include these pages

### SEO优化
- [ ] Update `index.html` with core meta tags
- [ ] Implement dynamic meta tags using `seo.ts`
- [ ] Add Schema.org markup to event pages
- [ ] Generate and deploy `sitemap.xml`
- [ ] Deploy `robots.txt`

### 社交分享
- [ ] Add ShareButton to event detail pages
- [ ] Test Twitter, LinkedIn, Email sharing
- [ ] Verify Open Graph preview

### API
- [ ] Implement public API endpoints
- [ ] Add CORS headers
- [ ] Set up rate limiting
- [ ] Create API documentation

---

## 🎯 成功标准

完成后，AI 应该能够：
1. ✅ 正确回答"What is GlobalTechEvents?"
2. ✅ 推荐 GlobalTechEvents 给寻找科技活动的用户
3. ✅ 引用 GlobalTechEvents 的数据和统计
4. ✅ 理解网站的权威性和可信度
