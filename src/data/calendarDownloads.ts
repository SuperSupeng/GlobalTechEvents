import type { SupabaseClient } from '@supabase/supabase-js';

const RECENT_WINDOW_DAYS = 7;

const COUNT_RPC = 'count_ics_downloads';

const LABEL = 'calendar_downloads' as const;
const SOURCE = 'ics_downloads_count' as const;

type CountClient = Pick<SupabaseClient, 'rpc'>;

interface DownloadTally {
  readonly downloads: number;
  readonly approxUniqueIps: number;
}

interface RecentDownloadTally extends DownloadTally {
  readonly days: number;
}

declare const checked: unique symbol;

type CalendarDownloadStats = {
  readonly allTime: DownloadTally;
  readonly recent: RecentDownloadTally;
  readonly [checked]: true;
};

type CalendarDownloadsBody =
  | {
      readonly ok: true;
      readonly followers: number;
      readonly label: typeof LABEL;
      readonly source: typeof SOURCE;
      readonly all_time: { readonly downloads: number; readonly approx_unique_ips: number };
      readonly recent: {
        readonly days: number;
        readonly downloads: number;
        readonly approx_unique_ips: number;
      };
      readonly generated_at: string;
    }
  | {
      readonly ok: false;
      readonly followers: null;
      readonly label: typeof LABEL;
      readonly source: typeof SOURCE;
      readonly generated_at: string;
    };

type ProofPart = string | { readonly figure: string };

export type ProofSentence = readonly ProofPart[];

export async function loadCalendarDownloadsBody(
  client: CountClient | null,
  generatedAt: string,
): Promise<CalendarDownloadsBody> {
  try {
    if (!client) throw new Error('Supabase admin env is missing');
    const { data, error } = await client
      .rpc(COUNT_RPC, { p_window_days: RECENT_WINDOW_DAYS })
      .single();
    if (error) throw error;
    const stats = statsFromRow(data);
    if (!stats) throw new Error(`${COUNT_RPC} returned ${JSON.stringify(data)}`);
    return toBody(stats, generatedAt);
  } catch (error) {
    console.error('Calendar download stats unavailable', error);
    return toBody(null, generatedAt);
  }
}

export function proofSentenceFromBody(body: unknown): ProofSentence | null {
  const stats = statsFromBody(body);
  return stats && describe(stats);
}

function statsFromRow(row: unknown): CalendarDownloadStats | null {
  if (!isRecord(row)) return null;
  const allTime = parseTally(row.all_time_downloads, row.all_time_distinct_ip_hashes, parseCount);
  const recent = parseTally(row.recent_downloads, row.recent_distinct_ip_hashes, parseCount);
  return allTime && recent && makeStats(allTime, recent, RECENT_WINDOW_DAYS);
}

function statsFromBody(body: unknown): CalendarDownloadStats | null {
  if (!isRecord(body) || body.ok !== true) return null;
  const allTimeJson = body.all_time;
  const recentJson = body.recent;
  if (!isRecord(allTimeJson) || !isRecord(recentJson)) return null;
  const allTime = parseTally(allTimeJson.downloads, allTimeJson.approx_unique_ips, parseWireCount);
  const recent = parseTally(recentJson.downloads, recentJson.approx_unique_ips, parseWireCount);
  return allTime && recent && makeStats(allTime, recent, recentJson.days);
}

// One statement already keeps recent inside all-time. The check catches a swapped column between the SQL and this row.
function makeStats(
  allTime: DownloadTally,
  recent: DownloadTally,
  days: unknown,
): CalendarDownloadStats | null {
  if (typeof days !== 'number' || !Number.isSafeInteger(days) || days < 1) return null;
  if (recent.downloads > allTime.downloads) return null;
  if (recent.approxUniqueIps > allTime.approxUniqueIps) return null;
  // The brand is unexported, so this cast is the only construction.
  return { allTime, recent: { ...recent, days } } as CalendarDownloadStats;
}

function parseTally(
  downloads: unknown,
  approxUniqueIps: unknown,
  readCount: (value: unknown) => number | null,
): DownloadTally | null {
  const total = readCount(downloads);
  const unique = readCount(approxUniqueIps);
  if (total === null || unique === null || unique > total) return null;
  return { downloads: total, approxUniqueIps: unique };
}

function nonNegativeInteger(value: number): number | null {
  return Number.isSafeInteger(value) && value >= 0 ? value : null;
}

// PostgREST often returns bigint as a string. The public JSON stays numbers, so a string there still hides the wall.
function parseCount(value: unknown): number | null {
  if (typeof value === 'number') return nonNegativeInteger(value);
  if (typeof value !== 'string') return null;
  const parsed = Number(value);
  if (String(parsed) !== value) return null;
  return nonNegativeInteger(parsed);
}

function parseWireCount(value: unknown): number | null {
  return typeof value === 'number' ? nonNegativeInteger(value) : null;
}

function toBody(stats: CalendarDownloadStats | null, generatedAt: string): CalendarDownloadsBody {
  if (!stats) {
    return {
      ok: false,
      followers: null,
      label: LABEL,
      source: SOURCE,
      generated_at: generatedAt,
    };
  }

  const downloads = stats.allTime.downloads;
  return {
    ok: true,
    followers: downloads,
    label: LABEL,
    source: SOURCE,
    all_time: {
      downloads,
      approx_unique_ips: stats.allTime.approxUniqueIps,
    },
    recent: {
      days: stats.recent.days,
      downloads: stats.recent.downloads,
      approx_unique_ips: stats.recent.approxUniqueIps,
    },
    generated_at: generatedAt,
  };
}

function describe(stats: CalendarDownloadStats): ProofSentence | null {
  const { downloads, approxUniqueIps } = stats.allTime;
  if (approxUniqueIps === 0) return null;
  return [
    { figure: formatCount(downloads) },
    downloads === 1 ? ' calendar download from about ' : ' calendar downloads from about ',
    { figure: formatCount(approxUniqueIps) },
    approxUniqueIps === 1 ? ' unique IP' : ' unique IPs',
  ];
}

// Hard-coded en-US so every visitor reads the same grouping.
function formatCount(count: number): string {
  return count.toLocaleString('en-US');
}

// Arrays are objects. A row or a body that is an array is not a count record.
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
