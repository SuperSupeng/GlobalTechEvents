import { useEffect } from 'react';
import { GA_MEASUREMENT_ID, GOOGLE_SITE_VERIFICATION } from '../config/publicEnv';

const GA_SCRIPT_ID = 'gte-ga4-loader';
const GSC_META_SELECTOR = 'meta[name="google-site-verification"][data-source="runtime"]';

const AnalyticsScripts = () => {
  useEffect(() => {
    if (!GOOGLE_SITE_VERIFICATION) return;

    let meta = document.head.querySelector<HTMLMetaElement>(GSC_META_SELECTOR);
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'google-site-verification';
      meta.dataset.source = 'runtime';
      document.head.appendChild(meta);
    }
    meta.content = GOOGLE_SITE_VERIFICATION;
  }, []);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    if (!document.getElementById(GA_SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = GA_SCRIPT_ID;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || ((...args: unknown[]) => {
      window.dataLayer?.push(args);
    });

    if (!window.__gteGa4Initialized) {
      window.gtag('js', new Date());
      window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: true });
      window.__gteGa4Initialized = true;
    }
  }, []);

  return null;
};

export default AnalyticsScripts;
