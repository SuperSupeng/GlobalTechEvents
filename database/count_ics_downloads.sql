-- One statement so the four counts share one snapshot. Only counts leave the database.
-- Anon would run this as SECURITY INVOKER under the SELECT policy USING (false) and
-- get zeros. Supabase grants a new public function to anon, so EXECUTE is revoked
-- here. CREATE OR REPLACE cannot change these return columns. Drop the function
-- before renaming one.
CREATE OR REPLACE FUNCTION public.count_ics_downloads(p_window_days integer)
RETURNS TABLE (
  all_time_downloads bigint,
  all_time_distinct_ip_hashes bigint,
  recent_downloads bigint,
  recent_distinct_ip_hashes bigint
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT
    count(*),
    count(DISTINCT ip_hash),
    count(*) FILTER (WHERE created_at >= now() - make_interval(days => p_window_days)),
    count(DISTINCT ip_hash) FILTER (WHERE created_at >= now() - make_interval(days => p_window_days))
  FROM public.ics_downloads;
$$;

REVOKE ALL ON FUNCTION public.count_ics_downloads(integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.count_ics_downloads(integer) TO service_role;

NOTIFY pgrst, 'reload schema';
