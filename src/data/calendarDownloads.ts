import type { SupabaseClient } from '@supabase/supabase-js';

const RECENT_WINDOW_DAYS = 7;

const COUNT_RPC = 'count_ics_downloads';

const LABEL = 'people_added_this_calendar' as const;

type CountClient = Pick<SupabaseClient, 'rpc'>;

interface DownloadTally {
  readonly downloads: number;
  readonly approxUniqueIps: number;
}

declare const publishedFloor: unique symbol;

type PublishedFloor = number & { readonly [publishedFloor]: true };

type CalendarDownloadsBody =
  | {
      readonly ok: true;
      readonly at_least: PublishedFloor;
      readonly label: typeof LABEL;
    }
  | {
      readonly ok: false;
    };

export type ProofSentence = readonly [
  { readonly figure: string },
  ' people added this calendar',
];

export async function loadCalendarDownloadsBody(
  client: CountClient | null,
): Promise<CalendarDownloadsBody> {
  try {
    if (!client) throw new Error('Supabase admin env is missing');
    const { data, error } = await client
      .rpc(COUNT_RPC, { p_window_days: RECENT_WINDOW_DAYS })
      .single();
    if (error) throw error;
    const tally = tallyFromRow(data);
    if (!tally) throw new Error(`${COUNT_RPC} returned ${JSON.stringify(data)}`);
    return toBody(floorForPublic(tally.approxUniqueIps));
  } catch (error) {
    console.error('Calendar download stats unavailable', error);
    return toBody(null);
  }
}

export function proofSentenceFromBody(body: unknown): ProofSentence | null {
  const atLeast = atLeastFromBody(body);
  if (atLeast === null || atLeast === 0) return null;
  return [{ figure: `${formatCount(atLeast)}+` }, ' people added this calendar'];
}

function tallyFromRow(row: unknown): DownloadTally | null {
  if (!isRecord(row)) return null;
  const downloads = parseCount(row.all_time_downloads);
  const approxUniqueIps = parseCount(row.all_time_distinct_ip_hashes);
  if (downloads === null || approxUniqueIps === null || approxUniqueIps > downloads) return null;
  return { downloads, approxUniqueIps };
}

function atLeastFromBody(body: unknown): number | null {
  if (!isRecord(body) || body.ok !== true || body.label !== LABEL) return null;
  return parseCount(body.at_least);
}

function floorForPublic(exact: number): PublishedFloor {
  const step = 10 ** Math.max(1, String(exact).length - 2);
  const floor = Math.floor(exact / step) * step;
  return floor as PublishedFloor;
}

function parseCount(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) return null;
  return value;
}

function toBody(floor: PublishedFloor | null): CalendarDownloadsBody {
  if (floor === null) return { ok: false };
  return {
    ok: true,
    at_least: floor,
    label: LABEL,
  };
}

const DISPLAY_LOCALE = 'en-US';

function formatCount(count: number): string {
  return count.toLocaleString(DISPLAY_LOCALE);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
