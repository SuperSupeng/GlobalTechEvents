import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { HOME_CANONICAL_HREF, SPA_SHELL_ROUTES } from '../src/seo/shellCanonicals.ts';

const HOME_SHELL = /\s*<!-- gte:home-shell:start -->[\s\S]*?<!-- gte:home-shell:end -->/;
const CANONICAL_TAG = /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function replaceOnce(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`SPA shell is missing ${label}`);
  return html.replace(pattern, replacement);
}

export function renderSpaRouteShell(indexHtml, route) {
  let html = indexHtml;
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${escapeHtml(route.title)}</title>`, 'title');
  html = replaceOnce(
    html,
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escapeHtml(route.description)}" />`,
    'description',
  );
  html = replaceOnce(
    html,
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${escapeHtml(route.title)}" />`,
    'og:title',
  );
  html = replaceOnce(
    html,
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${escapeHtml(route.description)}" />`,
    'og:description',
  );
  const canonical = `<link rel="canonical" href="${route.href}" />`;
  if (!CANONICAL_TAG.test(html)) throw new Error('index.html is missing the homepage canonical');
  html = html.replace(CANONICAL_TAG, canonical);
  if (!HOME_SHELL.test(html)) throw new Error('index.html is missing the home shell markers');
  html = html.replace(HOME_SHELL, '');
  if (html.includes('gte-home-shell')) throw new Error(`${route.path} still contains the homepage body`);
  if (!html.includes('<div id="root">') || !html.includes('src="/src/main.tsx"')) {
    throw new Error(`${route.path} lost the SPA mount`);
  }
  return html;
}

export function writeSpaRouteShells(indexPath = path.resolve('index.html')) {
  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  if (!indexHtml.includes(`<link rel="canonical" href="${HOME_CANONICAL_HREF}" />`)) {
    throw new Error('index.html is missing the homepage canonical');
  }
  for (const route of SPA_SHELL_ROUTES) {
    const html = renderSpaRouteShell(indexHtml, route);
    const dir = path.resolve(route.path.slice(1));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
  }
  return SPA_SHELL_ROUTES;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  const routes = writeSpaRouteShells();
  console.log(`Wrote ${routes.length} SPA route shells`);
}
