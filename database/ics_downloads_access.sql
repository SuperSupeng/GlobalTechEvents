-- The anon key ships in the browser. "Allow service role insert" is WITH CHECK (true),
-- so anon and authenticated can insert. service_role and the table owner bypass RLS,
-- and api/calendar.ts already writes with the service role. Without the policy, RLS
-- denies anon INSERT the same way it denies UPDATE and DELETE.
DROP POLICY IF EXISTS "Allow service role insert" ON public.ics_downloads;

-- record_ics_download is SECURITY DEFINER. Anon EXECUTE lets anyone insert a chosen
-- ip_hash and inflate the /api/followers unique-IP count. get_ics_download_stats is
-- the keyed breakdown behind /api/stats, and anon can call it without STATS_API_KEY.
REVOKE ALL ON FUNCTION public.record_ics_download(text, uuid, jsonb, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_ics_download(text, uuid, jsonb, text, text, text) TO service_role;

REVOKE ALL ON FUNCTION public.get_ics_download_stats() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_ics_download_stats() TO service_role;

NOTIFY pgrst, 'reload schema';
