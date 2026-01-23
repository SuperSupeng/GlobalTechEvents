/**
 * 国家/地区列表
 * 基于 ISO 3166-1 标准，采用政治中性表述
 */

export const COUNTRIES_REGIONS = [
  // North America
  { code: 'US', name: 'United States', region: 'North America' },
  { code: 'CA', name: 'Canada', region: 'North America' },
  { code: 'MX', name: 'Mexico', region: 'North America' },

  // Europe
  { code: 'GB', name: 'United Kingdom', region: 'Europe' },
  { code: 'DE', name: 'Germany', region: 'Europe' },
  { code: 'FR', name: 'France', region: 'Europe' },
  { code: 'NL', name: 'Netherlands', region: 'Europe' },
  { code: 'ES', name: 'Spain', region: 'Europe' },
  { code: 'IT', name: 'Italy', region: 'Europe' },
  { code: 'CH', name: 'Switzerland', region: 'Europe' },
  { code: 'SE', name: 'Sweden', region: 'Europe' },
  { code: 'NO', name: 'Norway', region: 'Europe' },
  { code: 'DK', name: 'Denmark', region: 'Europe' },
  { code: 'FI', name: 'Finland', region: 'Europe' },
  { code: 'PL', name: 'Poland', region: 'Europe' },
  { code: 'IE', name: 'Ireland', region: 'Europe' },
  { code: 'PT', name: 'Portugal', region: 'Europe' },
  { code: 'AT', name: 'Austria', region: 'Europe' },
  { code: 'BE', name: 'Belgium', region: 'Europe' },
  { code: 'CZ', name: 'Czech Republic', region: 'Europe' },

  // Asia-Pacific
  { code: 'CN', name: 'China', region: 'Asia-Pacific' },
  { code: 'JP', name: 'Japan', region: 'Asia-Pacific' },
  { code: 'KR', name: 'South Korea', region: 'Asia-Pacific' },
  { code: 'SG', name: 'Singapore', region: 'Asia-Pacific' },
  { code: 'HK', name: 'Hong Kong, China', region: 'Asia-Pacific' },
  { code: 'TW', name: 'Taiwan, China', region: 'Asia-Pacific' }, // 政治中性表述
  { code: 'IN', name: 'India', region: 'Asia-Pacific' },
  { code: 'AU', name: 'Australia', region: 'Asia-Pacific' },
  { code: 'NZ', name: 'New Zealand', region: 'Asia-Pacific' },
  { code: 'TH', name: 'Thailand', region: 'Asia-Pacific' },
  { code: 'MY', name: 'Malaysia', region: 'Asia-Pacific' },
  { code: 'ID', name: 'Indonesia', region: 'Asia-Pacific' },
  { code: 'PH', name: 'Philippines', region: 'Asia-Pacific' },
  { code: 'VN', name: 'Vietnam', region: 'Asia-Pacific' },

  // Middle East
  { code: 'IL', name: 'Israel', region: 'Middle East' },
  { code: 'AE', name: 'United Arab Emirates', region: 'Middle East' },
  { code: 'SA', name: 'Saudi Arabia', region: 'Middle East' },
  { code: 'TR', name: 'Turkey', region: 'Middle East' },

  // South America
  { code: 'BR', name: 'Brazil', region: 'South America' },
  { code: 'AR', name: 'Argentina', region: 'South America' },
  { code: 'CL', name: 'Chile', region: 'South America' },
  { code: 'CO', name: 'Colombia', region: 'South America' },

  // Africa
  { code: 'ZA', name: 'South Africa', region: 'Africa' },
  { code: 'NG', name: 'Nigeria', region: 'Africa' },
  { code: 'KE', name: 'Kenya', region: 'Africa' },
  { code: 'EG', name: 'Egypt', region: 'Africa' },
];

/**
 * 按地区分组
 */
export const REGIONS = [
  'North America',
  'Europe',
  'Asia-Pacific',
  'Middle East',
  'South America',
  'Africa',
] as const;

/**
 * 获取国家名称（用于显示）
 */
export function getCountryName(code: string): string {
  const country = COUNTRIES_REGIONS.find(c => c.code === code);
  return country?.name || code;
}

/**
 * 获取地区内的所有国家
 */
export function getCountriesByRegion(region: string) {
  return COUNTRIES_REGIONS.filter(c => c.region === region);
}

/**
 * 搜索国家/地区
 */
export function searchCountries(query: string) {
  const lowerQuery = query.toLowerCase();
  return COUNTRIES_REGIONS.filter(c => 
    c.name.toLowerCase().includes(lowerQuery) || 
    c.code.toLowerCase().includes(lowerQuery)
  );
}
