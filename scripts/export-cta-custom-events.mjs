#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const DEFAULT_SINCE = '7d';
const DEFAULT_LIMIT = '2000';
const TRACK_PREFIX = 'CTA_TRACK_EVENT ';

function parseArgs(argv) {
  const options = {
    since: DEFAULT_SINCE,
    limit: DEFAULT_LIMIT,
    outDir: path.resolve('artifacts/cta-custom-events'),
    project: 'global-tech-events',
    environment: 'production',
    deploymentUrl: '',
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];
    if (arg === '--since' && next) {
      options.since = next;
      index += 1;
    } else if (arg === '--until' && next) {
      options.until = next;
      index += 1;
    } else if (arg === '--from' && next) {
      options.since = next;
      index += 1;
    } else if (arg === '--to' && next) {
      options.until = next;
      index += 1;
    } else if (arg === '--limit' && next) {
      options.limit = next;
      index += 1;
    } else if (arg === '--out-dir' && next) {
      options.outDir = path.resolve(next);
      index += 1;
    } else if (arg === '--project' && next) {
      options.project = next;
      index += 1;
    } else if (arg === '--deployment-url' && next) {
      options.deploymentUrl = next;
      index += 1;
    } else if (arg === '--environment' && next) {
      options.environment = next;
      index += 1;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  return options;
}

function printHelp() {
  console.log(`Usage: node scripts/export-cta-custom-events.mjs [options]

Options:
  --since <relative|ISO>   Start time for Vercel logs (default: ${DEFAULT_SINCE})
  --until <relative|ISO>   End time for Vercel logs (default: now)
  --from <ISO>             Alias of --since
  --to <ISO>               Alias of --until
  --limit <n>              Max log lines to request (default: ${DEFAULT_LIMIT})
  --out-dir <path>         Output directory (default: artifacts/cta-custom-events)
  --project <name>         Vercel project name (default: global-tech-events)
  --deployment-url <url>   Use a specific deployment URL instead of auto-resolving latest prod
  --environment <env>      Vercel environment (default: production)
`);
}

function runJsonCommand(args) {
  const result = spawnSync('npx', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: process.env,
    maxBuffer: 20 * 1024 * 1024,
  });

  if (result.status !== 0) {
    throw new Error(`command failed with code ${result.status}\n${result.stderr || result.stdout}`);
  }

  return `${result.stdout}\n${result.stderr}`;
}

function resolveDeploymentUrl(options) {
  if (options.deploymentUrl) {
    return options.deploymentUrl.replace(/^https?:\/\//, '');
  }

  const rawOutput = runJsonCommand([
    'vercel',
    'list',
    options.project,
    '--environment',
    options.environment,
    '--status',
    'READY',
    '--format',
    'json',
  ]);

  const startIndex = rawOutput.indexOf('{');
  if (startIndex === -1) {
    throw new Error(`Failed to parse deployment list output:\n${rawOutput}`);
  }

  const parsed = JSON.parse(rawOutput.slice(startIndex));
  const deployment = parsed.deployments?.[0];
  if (!deployment?.url) {
    throw new Error(`No READY ${options.environment} deployment found for ${options.project}`);
  }

  return deployment.url;
}

function runVercelLogs(options) {
  const deploymentUrl = resolveDeploymentUrl(options);
  const args = [
    'vercel',
    'logs',
    deploymentUrl,
    '--json',
    '--no-follow',
    '--source',
    'serverless',
    '--since',
    options.since,
    '--limit',
    String(options.limit),
  ];

  if (options.until) {
    args.push('--until', options.until);
  }

  const result = spawnSync('npx', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: process.env,
    maxBuffer: 20 * 1024 * 1024,
  });

  if (result.status !== 0) {
    throw new Error(`vercel logs failed with code ${result.status}\n${result.stderr || result.stdout}`);
  }

  return `${result.stdout}\n${result.stderr}`;
}

function parseLogLine(line) {
  if (!line.trim().startsWith('{')) {
    return null;
  }

  try {
    return JSON.parse(line);
  } catch {
    return null;
  }
}

function extractMessage(entry) {
  if (!entry || typeof entry !== 'object') {
    return '';
  }

  const candidates = [
    entry.message,
    entry.text,
    entry.output,
    entry.log?.message,
    entry.data?.message,
    entry.data?.text,
  ];

  for (const value of candidates) {
    if (typeof value === 'string' && value.includes(TRACK_PREFIX)) {
      return value;
    }
  }

  return '';
}

function extractTimestamp(entry, fallback) {
  const candidates = [entry?.timestamp, entry?.created, entry?.createdAt, entry?.time];
  for (const value of candidates) {
    if (typeof value === 'string' && value) {
      return value;
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
      return new Date(value).toISOString();
    }
  }
  return fallback;
}

function collectEvents(rawOutput) {
  const events = [];

  for (const line of rawOutput.split(/\r?\n/)) {
    const entry = parseLogLine(line);
    if (!entry) continue;

    const message = extractMessage(entry);
    if (!message) continue;

    const payloadText = message.slice(message.indexOf(TRACK_PREFIX) + TRACK_PREFIX.length).trim();
    try {
      const payload = JSON.parse(payloadText);
      events.push({
        tracked_at: extractTimestamp(entry, payload.tracked_at || new Date().toISOString()),
        ...payload,
      });
    } catch {
      // ignore malformed lines
    }
  }

  return events.sort((a, b) => String(a.tracked_at).localeCompare(String(b.tracked_at)));
}

function summarizeEvents(events) {
  const summary = {
    total_events: events.length,
    by_cta_type: {},
    by_page_type: {},
    by_event_slug: {},
    by_breakdown: {},
  };

  for (const event of events) {
    const ctaType = event.cta_type || 'unknown';
    const pageType = event.page_type || 'unknown';
    const eventSlug = event.event_slug || 'unknown';
    const breakdownKey = `${eventSlug}__${pageType}__${ctaType}`;

    summary.by_cta_type[ctaType] = (summary.by_cta_type[ctaType] || 0) + 1;
    summary.by_page_type[pageType] = (summary.by_page_type[pageType] || 0) + 1;
    summary.by_event_slug[eventSlug] = (summary.by_event_slug[eventSlug] || 0) + 1;
    summary.by_breakdown[breakdownKey] = (summary.by_breakdown[breakdownKey] || 0) + 1;
  }

  return summary;
}

function buildCsv(events) {
  const header = [
    'tracked_at',
    'event_name',
    'cta_type',
    'page_type',
    'event_slug',
    'source_page',
    'cta_label',
    'calendar_provider',
    'target_url',
  ];

  const escapeCsv = (value) => {
    const text = String(value ?? '');
    if (/[,"\n]/.test(text)) {
      return `"${text.replaceAll('"', '""')}"`;
    }
    return text;
  };

  const rows = events.map((event) =>
    header
      .map((column) => escapeCsv(event[column]))
      .join(','),
  );

  return [header.join(','), ...rows].join('\n') + '\n';
}

function buildBreakdownCsv(summary) {
  const rows = [['event_slug', 'page_type', 'cta_type', 'count']];
  for (const [key, count] of Object.entries(summary.by_breakdown).sort()) {
    const [eventSlug, pageType, ctaType] = key.split('__');
    rows.push([eventSlug, pageType, ctaType, String(count)]);
  }
  return rows.map((row) => row.join(',')).join('\n') + '\n';
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeOutputs(options, events, summary) {
  ensureDir(options.outDir);
  const stamp = new Date().toISOString().replace(/[:]/g, '-');
  const rawPath = path.join(options.outDir, `cta-custom-events-${stamp}.json`);
  const csvPath = path.join(options.outDir, `cta-custom-events-${stamp}.csv`);
  const summaryPath = path.join(options.outDir, `cta-custom-events-summary-${stamp}.json`);
  const breakdownCsvPath = path.join(options.outDir, `cta-custom-events-breakdown-${stamp}.csv`);
  const latestRawPath = path.join(options.outDir, 'latest.json');
  const latestCsvPath = path.join(options.outDir, 'latest.csv');
  const latestSummaryPath = path.join(options.outDir, 'latest-summary.json');
  const latestBreakdownPath = path.join(options.outDir, 'latest-breakdown.csv');

  fs.writeFileSync(rawPath, JSON.stringify(events, null, 2) + '\n');
  fs.writeFileSync(csvPath, buildCsv(events));
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2) + '\n');
  fs.writeFileSync(breakdownCsvPath, buildBreakdownCsv(summary));

  fs.copyFileSync(rawPath, latestRawPath);
  fs.copyFileSync(csvPath, latestCsvPath);
  fs.copyFileSync(summaryPath, latestSummaryPath);
  fs.copyFileSync(breakdownCsvPath, latestBreakdownPath);

  return {
    rawPath,
    csvPath,
    summaryPath,
    breakdownCsvPath,
    latestRawPath,
    latestCsvPath,
    latestSummaryPath,
    latestBreakdownPath,
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const rawOutput = runVercelLogs(options);
  const events = collectEvents(rawOutput);
  const summary = summarizeEvents(events);
  const outputs = writeOutputs(options, events, summary);

  console.log(
    JSON.stringify(
      {
        ok: true,
        options,
        event_count: events.length,
        summary,
        outputs,
      },
      null,
      2,
    ),
  );
}

main();
