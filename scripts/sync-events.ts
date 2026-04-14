import { runEventSync } from '../api/_lib/event-sync';

function parseArgs(argv: string[]) {
  const args = new Set(argv);
  const getValue = (flag: string) => {
    const entry = argv.find((item) => item.startsWith(`${flag}=`));
    return entry ? entry.slice(flag.length + 1) : undefined;
  };

  const limitRaw = getValue('--limit');
  const eventId = getValue('--event-id');

  return {
    dryRun: args.has('--dry-run'),
    limit: limitRaw ? Number(limitRaw) : undefined,
    eventId,
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const summary = await runEventSync(options);
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
