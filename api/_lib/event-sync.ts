import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getMissingSupabaseEnv, getSupabaseAdmin } from './supabase-admin';

type EventStatus = 'upcoming' | 'live' | 'ended' | 'canceled';

interface EventRecord {
  id: string;
  title: string;
  summary: string | null;
  start_time: string;
  end_time: string;
  timezone: string;
  format: 'online' | 'offline' | 'hybrid';
  location: Record<string, unknown> | null;
  links: Record<string, unknown> | null;
  organizer: Record<string, unknown> | null;
  tags: string[] | null;
  language: string[] | null;
  price: Record<string, unknown> | null;
  status: EventStatus;
}

interface RemoteEventData {
  endTime?: string;
  location?: Record<string, unknown>;
  officialSite?: string;
  registration?: string;
  startTime?: string;
  status?: EventStatus;
}

export interface SyncOptions {
  dryRun?: boolean;
  limit?: number;
  eventId?: string;
}

export interface SyncEventSummary {
  eventId: string;
  title: string;
  sourceUrl: string | null;
  action: 'updated' | 'skipped' | 'failed';
  changes: Array<{
    field: string;
    from: unknown;
    to: unknown;
  }>;
  notes: string[];
}

export interface SyncSummary {
  dryRun: boolean;
  scanned: number;
  updated: number;
  skipped: number;
  failed: number;
  startedAt: string;
  finishedAt: string;
  results: SyncEventSummary[];
}

const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (compatible; GlobalTechEventsBot/1.0; +https://www.globaltechevents.xyz)';

function getReadClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const publicKey =
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publicKey) {
    return null;
  }

  return createClient(supabaseUrl, publicKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function fetchEvents(
  supabase: SupabaseClient,
  options: SyncOptions,
): Promise<EventRecord[]> {
  let query = supabase
    .from('events')
    .select('id,title,summary,start_time,end_time,timezone,format,location,links,organizer,tags,language,price,status')
    .order('start_time', { ascending: true });

  if (options.eventId) {
    query = query.eq('id', options.eventId);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load events from Supabase: ${error.message}`);
  }

  return (data ?? []) as EventRecord[];
}

function isHttpUrl(value: unknown): value is string {
  if (typeof value !== 'string' || !value) {
    return false;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function normalizeString(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function normalizeUrl(value: string) {
  try {
    const parsed = new URL(value);
    parsed.hash = '';
    if (parsed.pathname.endsWith('/') && parsed.pathname !== '/') {
      parsed.pathname = parsed.pathname.slice(0, -1);
    }
    return parsed.toString();
  } catch {
    return value;
  }
}

function normalizeIsoDate(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function computeStatus(startTime: string, endTime: string): EventStatus {
  const now = Date.now();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return 'upcoming';
  }

  if (now < start) return 'upcoming';
  if (now > end) return 'ended';
  return 'live';
}

function getSourceUrl(event: EventRecord) {
  const links = event.links ?? {};
  const candidates = [
    links.source,
    links.officialSite,
    links.registration,
  ];

  for (const candidate of candidates) {
    if (isHttpUrl(candidate)) {
      return candidate;
    }
  }

  return null;
}

function extractJsonLdBlocks(html: string) {
  const matches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) ?? [];

  return matches
    .map((block) => block.replace(/^<script[^>]*>/i, '').replace(/<\/script>$/i, '').trim())
    .map((block) => {
      try {
        return JSON.parse(block);
      } catch {
        return null;
      }
    })
    .filter(Boolean) as unknown[];
}

function collectEventCandidates(input: unknown, into: Record<string, unknown>[] = []) {
  if (!input) return into;

  if (Array.isArray(input)) {
    input.forEach((item) => collectEventCandidates(item, into));
    return into;
  }

  if (typeof input !== 'object') {
    return into;
  }

  const record = input as Record<string, unknown>;
  const rawType = record['@type'];
  const types = Array.isArray(rawType) ? rawType : [rawType];
  const normalizedTypes = types
    .filter((value): value is string => typeof value === 'string')
    .map((value) => value.toLowerCase());

  if (normalizedTypes.some((value) => value === 'event')) {
    into.push(record);
  }

  Object.values(record).forEach((value) => collectEventCandidates(value, into));
  return into;
}

function parseLocation(location: unknown) {
  if (!location || typeof location !== 'object') {
    return undefined;
  }

  const record = location as Record<string, unknown>;
  const address = typeof record.address === 'object' && record.address ? (record.address as Record<string, unknown>) : null;
  const city =
    (typeof record.addressLocality === 'string' && record.addressLocality) ||
    (typeof address?.addressLocality === 'string' && address.addressLocality) ||
    undefined;
  const country =
    (typeof record.addressCountry === 'string' && record.addressCountry) ||
    (typeof address?.addressCountry === 'string' && address.addressCountry) ||
    undefined;
  const name = typeof record.name === 'string' ? record.name : undefined;
  const streetAddress =
    (typeof address?.streetAddress === 'string' && address.streetAddress) ||
    (typeof record.streetAddress === 'string' && record.streetAddress) ||
    undefined;

  if (!city && !country && !name && !streetAddress) {
    return undefined;
  }

  return {
    ...(city ? { city } : {}),
    ...(country ? { country } : {}),
    ...(name || streetAddress ? { address: streetAddress || name } : {}),
  };
}

function scoreCandidate(candidate: Record<string, unknown>, title: string, sourceUrl: string) {
  let score = 0;
  const candidateName = typeof candidate.name === 'string' ? candidate.name : '';
  const normalizedCandidateName = normalizeString(candidateName);
  const normalizedTitle = normalizeString(title);

  if (normalizedCandidateName && normalizedTitle) {
    if (normalizedCandidateName === normalizedTitle) {
      score += 100;
    } else if (normalizedCandidateName.includes(normalizedTitle) || normalizedTitle.includes(normalizedCandidateName)) {
      score += 60;
    }
  }

  if (normalizeIsoDate(candidate.startDate)) {
    score += 30;
  }

  if (normalizeIsoDate(candidate.endDate)) {
    score += 20;
  }

  if (isHttpUrl(candidate.url)) {
    try {
      if (new URL(candidate.url).hostname === new URL(sourceUrl).hostname) {
        score += 10;
      }
    } catch {
      // ignore bad urls
    }
  }

  return score;
}

function extractRemoteEventData(html: string, event: EventRecord, sourceUrl: string): RemoteEventData | null {
  const jsonLdBlocks = extractJsonLdBlocks(html);
  const candidates = jsonLdBlocks.flatMap((block) => collectEventCandidates(block));

  if (!candidates.length) {
    return null;
  }

  const best = candidates
    .map((candidate) => ({ candidate, score: scoreCandidate(candidate, event.title, sourceUrl) }))
    .sort((a, b) => b.score - a.score)[0];

  if (!best || best.score < 30) {
    return null;
  }

  const startTime = normalizeIsoDate(best.candidate.startDate);
  const endTime = normalizeIsoDate(best.candidate.endDate);
  const location = parseLocation(best.candidate.location);
  const officialSite = isHttpUrl(best.candidate.url) ? best.candidate.url : undefined;
  const offers = Array.isArray(best.candidate.offers)
    ? best.candidate.offers.find((offer) => typeof offer === 'object' && offer && isHttpUrl((offer as Record<string, unknown>).url))
    : typeof best.candidate.offers === 'object' && best.candidate.offers
      ? best.candidate.offers
      : null;
  const registration =
    offers && typeof offers === 'object' && isHttpUrl((offers as Record<string, unknown>).url)
      ? ((offers as Record<string, unknown>).url as string)
      : undefined;

  return {
    ...(startTime ? { startTime } : {}),
    ...(endTime ? { endTime } : {}),
    ...(location ? { location } : {}),
    ...(officialSite ? { officialSite } : {}),
    ...(registration ? { registration } : {}),
    ...(startTime && endTime ? { status: computeStatus(startTime, endTime) } : {}),
  };
}

async function fetchHtml(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': DEFAULT_USER_AGENT,
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    const html = await response.text();

    return {
      ok: response.ok,
      status: response.status,
      url: response.url,
      html,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function pickLinksPatch(event: EventRecord, remote: RemoteEventData) {
  const currentLinks = { ...(event.links ?? {}) };
  let changed = false;

  if (remote.officialSite && normalizeUrl(remote.officialSite) !== normalizeUrl(String(currentLinks.officialSite ?? ''))) {
    currentLinks.officialSite = remote.officialSite;
    changed = true;
  }

  if (remote.registration && normalizeUrl(remote.registration) !== normalizeUrl(String(currentLinks.registration ?? ''))) {
    currentLinks.registration = remote.registration;
    changed = true;
  }

  return changed ? currentLinks : null;
}

function valuesDiffer(left: unknown, right: unknown) {
  return JSON.stringify(left) !== JSON.stringify(right);
}

function isReasonableDateShift(currentValue: string, remoteValue: string) {
  const current = new Date(currentValue).getTime();
  const remote = new Date(remoteValue).getTime();

  if (Number.isNaN(current) || Number.isNaN(remote)) {
    return false;
  }

  const diffDays = Math.abs(remote - current) / (1000 * 60 * 60 * 24);
  return diffDays <= 45;
}

function buildPatch(event: EventRecord, remote: RemoteEventData | null) {
  const patch: Record<string, unknown> = {};
  const changes: SyncEventSummary['changes'] = [];
  const remoteDatesLookSafe =
    !remote?.startTime || !remote?.endTime
      ? false
      : isReasonableDateShift(event.start_time, remote.startTime) &&
        isReasonableDateShift(event.end_time, remote.endTime);

  const desiredStatus = remoteDatesLookSafe && remote?.status
    ? remote.status
    : computeStatus(event.start_time, event.end_time);
  if (desiredStatus !== event.status) {
    patch.status = desiredStatus;
    changes.push({ field: 'status', from: event.status, to: desiredStatus });
  }

  if (remoteDatesLookSafe && remote?.startTime && remote.startTime !== event.start_time) {
    patch.start_time = remote.startTime;
    changes.push({ field: 'start_time', from: event.start_time, to: remote.startTime });
  }

  if (remoteDatesLookSafe && remote?.endTime && remote.endTime !== event.end_time) {
    patch.end_time = remote.endTime;
    changes.push({ field: 'end_time', from: event.end_time, to: remote.endTime });
  }

  if (remoteDatesLookSafe && remote?.location && valuesDiffer(remote.location, event.location ?? null)) {
    patch.location = remote.location;
    changes.push({ field: 'location', from: event.location ?? null, to: remote.location });
  }

  const linksPatch = remote ? pickLinksPatch(event, remote) : null;
  if (linksPatch && valuesDiffer(linksPatch, event.links ?? null)) {
    patch.links = linksPatch;
    changes.push({ field: 'links', from: event.links ?? null, to: linksPatch });
  }

  return { patch, changes, remoteDatesLookSafe };
}

async function syncSingleEvent(
  supabase: SupabaseClient,
  event: EventRecord,
  dryRun: boolean,
): Promise<SyncEventSummary> {
  const sourceUrl = getSourceUrl(event);
  const notes: string[] = [];

  let remote: RemoteEventData | null = null;

  if (!sourceUrl) {
    notes.push('缺少可抓取的 source/officialSite URL，只执行了时间状态刷新。');
  } else {
    try {
      const response = await fetchHtml(sourceUrl);
      if (!response.ok) {
        notes.push(`抓取失败，HTTP ${response.status}。`);
      } else {
        if (normalizeUrl(response.url) !== normalizeUrl(sourceUrl)) {
          notes.push(`源地址跳转到 ${response.url}`);
        }
        remote = extractRemoteEventData(response.html, event, response.url);
        if (!remote) {
          notes.push('未从页面 JSON-LD 提取到可用 Event 结构化数据，仅执行时间状态刷新。');
        }
      }
    } catch (error) {
      notes.push(error instanceof Error ? `抓取异常：${error.message}` : '抓取异常');
    }
  }

  const { patch, changes, remoteDatesLookSafe } = buildPatch(event, remote);

  if (remote && remote.startTime && remote.endTime && !remoteDatesLookSafe) {
    notes.push('官网返回的日期与当前库内日期偏差过大，已忽略远端日期/地点覆盖，避免误改。');
  }

  if (!changes.length) {
    return {
      eventId: event.id,
      title: event.title,
      sourceUrl,
      action: 'skipped',
      changes,
      notes,
    };
  }

  if (!dryRun) {
    const { error } = await supabase.from('events').update(patch).eq('id', event.id);
    if (error) {
      return {
        eventId: event.id,
        title: event.title,
        sourceUrl,
        action: 'failed',
        changes,
        notes: [...notes, `写回 Supabase 失败：${error.message}`],
      };
    }
  }

  return {
    eventId: event.id,
    title: event.title,
    sourceUrl,
    action: 'updated',
    changes,
    notes,
  };
}

export async function runEventSync(options: SyncOptions = {}): Promise<SyncSummary> {
  const dryRun = options.dryRun ?? false;
  const startedAt = new Date().toISOString();

  const writableClient = getSupabaseAdmin();
  const readableClient = writableClient ?? getReadClient();

  if (!readableClient) {
    const missing = getMissingSupabaseEnv();
    const publicMissing = [];

    if (!(process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)) {
      publicMissing.push('VITE_SUPABASE_ANON_KEY / SUPABASE_PUBLISHABLE_KEY');
    }
    if (!(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)) {
      publicMissing.push('VITE_SUPABASE_URL or SUPABASE_URL');
    }

    const allMissing = Array.from(new Set([...missing, ...publicMissing]));
    throw new Error(`Supabase 环境变量缺失：${allMissing.join(', ')}`);
  }

  if (!dryRun && !writableClient) {
    throw new Error('执行写入模式需要 SUPABASE_SERVICE_ROLE_KEY。');
  }

  const events = await fetchEvents(readableClient, options);
  const writer = writableClient ?? readableClient;
  const results: SyncEventSummary[] = [];

  for (const event of events) {
    results.push(await syncSingleEvent(writer, event, dryRun));
  }

  const finishedAt = new Date().toISOString();
  const summary: SyncSummary = {
    dryRun,
    scanned: results.length,
    updated: results.filter((item) => item.action === 'updated').length,
    skipped: results.filter((item) => item.action === 'skipped').length,
    failed: results.filter((item) => item.action === 'failed').length,
    startedAt,
    finishedAt,
    results,
  };

  return summary;
}
