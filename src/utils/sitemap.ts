import { TechEvent } from '../types';

/**
 * 生成 XML Sitemap
 */
export function generateSitemap(events: TechEvent[]): string {
  const baseUrl = 'https://globaltechevents.com';
  const today = new Date().toISOString().split('T')[0];

  const urls = [
    // 首页
    {
      loc: baseUrl,
      lastmod: today,
      changefreq: 'daily',
      priority: '1.0',
    },
    // 活动页
    ...events.map(event => ({
      loc: `${baseUrl}/event/${event.id}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8',
    })),
    // 标签页（从活动中提取所有标签）
    ...Array.from(new Set(events.flatMap(e => e.tags))).map(tag => ({
      loc: `${baseUrl}/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.7',
    })),
    // 地区页
    ...Array.from(new Set(
      events
        .filter(e => e.location)
        .map(e => `${e.location!.city}, ${e.location!.country}`)
    )).map(location => ({
      loc: `${baseUrl}/location/${location.toLowerCase().replace(/\s+/g, '-')}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.7',
    })),
  ];

  const urlsXml = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
}

/**
 * 生成 robots.txt 内容
 */
export function generateRobotsTxt(): string {
  return `# GlobalTechEvents Robots.txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

# AI Crawlers (Allow all for GEO optimization)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Googlebot
Allow: /

# Sitemap
Sitemap: https://globaltechevents.com/sitemap.xml
`;
}
