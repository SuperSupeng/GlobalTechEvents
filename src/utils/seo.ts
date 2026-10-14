import { TechEvent } from '../types';

interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  twitterCard: 'summary' | 'summary_large_image';
  canonicalUrl: string;
}

/**
 * 生成首页 SEO metadata
 */
export function getHomeSEO(): SEOMetadata {
  return {
    title: 'GlobalTechEvents — Major tech events in one calendar',
    description: 'Unified calendar of globally known major tech events. Subscribe via calendar or WhatsApp—built for industry professionals.',
    keywords: 'tech events calendar, global conferences, industry events, ICS subscribe',
    ogTitle: 'GlobalTechEvents — Major tech events in one calendar',
    ogDescription: 'Unified calendar of globally known major tech events. Subscribe via calendar or WhatsApp—built for industry professionals.',
    twitterCard: 'summary_large_image',
    canonicalUrl: 'https://www.globaltechevents.xyz',
  };
}

/**
 * 生成活动详情页 SEO metadata
 */
export function getEventSEO(event: TechEvent): SEOMetadata {
  const eventDate = new Date(event.startTime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const location = event.format === 'online' 
    ? 'Online Event' 
    : `${event.location?.city}, ${event.location?.country}`;

  return {
    title: `${event.title} - ${eventDate} | GlobalTechEvents`,
    description: `${event.summary.substring(0, 155)}... Join this ${event.format} tech event. ${event.price.type === 'free' ? 'Free admission' : event.price.range}.`,
    keywords: `${event.tags.join(', ')}, ${event.title}, tech event, ${location}, ${eventDate}`,
    ogTitle: event.title,
    ogDescription: event.summary,
    ogImage: event.coverImage,
    twitterCard: event.coverImage ? 'summary_large_image' : 'summary',
    canonicalUrl: `https://www.globaltechevents.xyz/event/${event.id}`,
  };
}

/**
 * 生成标签页 SEO metadata
 */
export function getTagSEO(tag: string): SEOMetadata {
  return {
    title: `${tag} Events & Conferences 2026 | GlobalTechEvents`,
    description: `Discover upcoming ${tag} events, conferences, and meetups worldwide. Find the best ${tag} tech events, workshops, and networking opportunities.`,
    keywords: `${tag} events, ${tag} conferences, ${tag} meetups, ${tag} summit, ${tag} hackathon, ${tag} workshop`,
    ogTitle: `Best ${tag} Events & Conferences`,
    ogDescription: `Explore ${tag} events happening around the world. Stay updated with the latest ${tag} conferences and meetups.`,
    twitterCard: 'summary',
    canonicalUrl: `https://www.globaltechevents.xyz/tag/${tag.toLowerCase()}`,
  };
}

/**
 * 生成地区页 SEO metadata
 */
export function getLocationSEO(location: string): SEOMetadata {
  return {
    title: `Tech Events in ${location} 2026 | GlobalTechEvents`,
    description: `Find tech conferences, developer meetups, and AI summits in ${location}. Discover upcoming technology events happening in ${location}.`,
    keywords: `tech events ${location}, developer conferences ${location}, tech meetup ${location}, AI summit ${location}, hackathon ${location}`,
    ogTitle: `Tech Events in ${location}`,
    ogDescription: `Explore upcoming tech events, conferences, and meetups in ${location}. Connect with the tech community.`,
    twitterCard: 'summary',
    canonicalUrl: `https://www.globaltechevents.xyz/location/${location.toLowerCase().replace(/\s+/g, '-')}`,
  };
}

/**
 * 更新页面 meta 标签
 */
export function updateMetaTags(metadata: SEOMetadata) {
  // Title
  document.title = metadata.title;

  // Meta Description
  updateOrCreateMetaTag('name', 'description', metadata.description);
  updateOrCreateMetaTag('name', 'keywords', metadata.keywords);

  // Open Graph
  updateOrCreateMetaTag('property', 'og:title', metadata.ogTitle);
  updateOrCreateMetaTag('property', 'og:description', metadata.ogDescription);
  updateOrCreateMetaTag('property', 'og:url', metadata.canonicalUrl);
  updateOrCreateMetaTag('property', 'og:type', 'website');
  
  if (metadata.ogImage) {
    updateOrCreateMetaTag('property', 'og:image', metadata.ogImage);
  }

  // Twitter Card
  updateOrCreateMetaTag('name', 'twitter:card', metadata.twitterCard);
  updateOrCreateMetaTag('name', 'twitter:title', metadata.ogTitle);
  updateOrCreateMetaTag('name', 'twitter:description', metadata.ogDescription);
  
  if (metadata.ogImage) {
    updateOrCreateMetaTag('name', 'twitter:image', metadata.ogImage);
  }

  // Canonical URL
  updateOrCreateLinkTag('canonical', metadata.canonicalUrl);
}

/**
 * 辅助函数：更新或创建 meta 标签
 */
function updateOrCreateMetaTag(attribute: string, name: string, content: string) {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.content = content;
}

/**
 * 辅助函数：更新或创建 link 标签
 */
function updateOrCreateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  
  element.href = href;
}

/**
 * 生成 JSON-LD 结构化数据（活动）
 */
export function generateEventSchema(event: TechEvent): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.summary,
    startDate: event.startTime,
    endDate: event.endTime,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: event.format === 'online' 
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : event.format === 'hybrid'
      ? 'https://schema.org/MixedEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    location: event.format === 'online' ? {
      '@type': 'VirtualLocation',
      url: event.links.officialSite
    } : {
      '@type': 'Place',
      name: event.location?.city,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.location?.city,
        addressCountry: event.location?.country,
      }
    },
    image: event.coverImage ? [event.coverImage] : [],
    organizer: {
      '@type': 'Organization',
      name: event.organizer.name,
      url: event.links.officialSite
    },
    offers: event.price.type === 'free' ? {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: event.links.registration || event.links.officialSite
    } : undefined,
    url: event.links.officialSite,
    isAccessibleForFree: event.price.type === 'free',
  };

  return JSON.stringify(schema);
}

/**
 * 注入结构化数据到页面
 */
export function injectSchema(schemaJson: string) {
  // 移除旧的 schema
  const oldSchema = document.querySelector('script[type="application/ld+json"]');
  if (oldSchema) {
    oldSchema.remove();
  }

  // 注入新的 schema
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = schemaJson;
  document.head.appendChild(script);
}
