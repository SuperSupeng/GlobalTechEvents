import { supabase } from '../config/supabase';
import type { TechEvent } from '../types';

export interface EventFilters {
  search?: string;
  format?: 'all' | 'online' | 'offline' | 'hybrid';
  location?: string;
  tag?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

/**
 * 获取活动列表
 */
export async function fetchEvents(filters: EventFilters = {}): Promise<TechEvent[]> {
  try {
    let query = supabase
      .from('events')
      .select('*')
      .order('start_time', { ascending: true });

    // 只显示即将到来和正在进行的活动
    query = query.in('status', ['upcoming', 'live']);

    // 格式筛选
    if (filters.format && filters.format !== 'all') {
      query = query.eq('format', filters.format);
    }

    // 地点筛选
    if (filters.location && filters.location !== 'all') {
      if (filters.location === 'online') {
        query = query.eq('format', 'online');
      } else {
        // 搜索城市或国家（清理输入防止注入）
        const cityName = filters.location.split(',')[0].trim()
          .replace(/[^\w\s\u4e00-\u9fa5-]/g, ''); // 只保留字母、数字、空格、中文、连字符
        
        if (cityName) {
          query = query.or(`location->>city.eq.${cityName},location->>country.eq.${cityName}`);
        }
      }
    }

    // Tag filter (e.g. Featured for paid/partner events)
    if (filters.tag) {
      query = query.contains('tags', [filters.tag]);
    }

    // Search keywords
    if (filters.search) {
      const searchTerm = `%${filters.search}%`;
      query = query.or(`title.ilike.${searchTerm},summary.ilike.${searchTerm}`);
    }

    // 日期范围
    if (filters.startDate) {
      query = query.gte('start_time', filters.startDate.toISOString());
    }

    if (filters.endDate) {
      query = query.lte('start_time', filters.endDate.toISOString());
    }

    // 分页
    const limit = filters.limit || 100;
    const offset = filters.offset || 0;
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }

    // 转换数据格式以匹配前端类型
    return (data || []).map(transformEvent);
  } catch (error) {
    console.error('Failed to fetch events:', error);
    throw error;
  }
}

/**
 * 获取单个活动详情
 */
export async function fetchEventById(id: string): Promise<TechEvent | null> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching event:', error);
      throw error;
    }

    return data ? transformEvent(data) : null;
  } catch (error) {
    console.error('Failed to fetch event:', error);
    return null;
  }
}

/**
 * 获取所有唯一的地点列表
 */
export async function fetchLocations(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('location')
      .not('location', 'is', null);

    if (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }

    // 提取唯一城市列表
    const locations = new Set<string>();
    (data || []).forEach((event: any) => {
      if (event.location?.city && event.location?.country) {
        locations.add(`${event.location.city}, ${event.location.country}`);
      }
    });

    return Array.from(locations).sort();
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    return [];
  }
}

/**
 * 转换数据库格式到前端类型
 */
function transformEvent(dbEvent: any): TechEvent {
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    summary: dbEvent.summary || '',
    coverImage: dbEvent.cover_image,
    startTime: dbEvent.start_time,
    endTime: dbEvent.end_time,
    timezone: dbEvent.timezone,
    isAllDay: dbEvent.is_all_day,
    format: dbEvent.format,
    location: dbEvent.location,
    tags: dbEvent.tags || [],
    language: dbEvent.language || ['English'],
    links: dbEvent.links,
    organizer: dbEvent.organizer,
    price: dbEvent.price || { type: 'unknown' },
    status: dbEvent.status || 'upcoming',
  };
}
