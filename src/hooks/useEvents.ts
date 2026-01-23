import { useQuery } from '@tanstack/react-query';
import { fetchEvents, fetchLocations, type EventFilters } from '../api/events';

/**
 * 获取活动列表的 Hook
 */
export function useEvents(filters: EventFilters = {}) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => fetchEvents(filters),
    staleTime: 5 * 60 * 1000, // 5分钟内数据被认为是新鲜的
    gcTime: 10 * 60 * 1000, // 10分钟后清除缓存
    refetchOnWindowFocus: false, // 窗口聚焦时不自动重新获取
    placeholderData: (previousData) => previousData, // 保留之前的数据，避免闪烁
    retry: 2, // 失败后重试2次
  });
}

/**
 * 获取地点列表的 Hook
 */
export function useLocations() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: fetchLocations,
    staleTime: 30 * 60 * 1000, // 30分钟内数据被认为是新鲜的
    gcTime: 60 * 60 * 1000, // 1小时后清除缓存
  });
}
