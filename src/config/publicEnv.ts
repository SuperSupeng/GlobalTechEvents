const readEnv = (value?: string) => value?.trim() ?? '';

export const GA_MEASUREMENT_ID = readEnv(
  import.meta.env.VITE_GA_MEASUREMENT_ID || import.meta.env.GA_MEASUREMENT_ID,
);

export const GOOGLE_SITE_VERIFICATION = readEnv(
  import.meta.env.GOOGLE_SITE_VERIFICATION,
);

export const PUBLIC_SUPABASE_URL = readEnv(import.meta.env.VITE_SUPABASE_URL);

export const isGaEnabled = Boolean(GA_MEASUREMENT_ID);
export const isGoogleSiteVerificationEnabled = Boolean(GOOGLE_SITE_VERIFICATION);
