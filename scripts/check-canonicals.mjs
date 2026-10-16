import assert from 'node:assert/strict';
import fs from 'node:fs';
import { HOME_CANONICAL_HREF, SPA_SHELL_ROUTES, canonicalHrefForPath } from '../src/seo/shellCanonicals.ts';
import { resolveAppRoute } from '../src/routing/resolveAppRoute.ts';
import { getHomeSEO } from '../src/utils/seo.ts';
import { renderSpaRouteShell } from './spa-route-shells.mjs';

function canonicals(html) {
  return [...html.matchAll(/<link\s+rel="canonical"\s+href="([^"]*)"\s*\/?>/g)].map((match) => match[1]);
}

const indexHtml = fs.readFileSync('index.html', 'utf8');
assert.deepEqual(canonicals(indexHtml), [HOME_CANONICAL_HREF], 'homepage shell');
assert.doesNotMatch(indexHtml, /<link\s+rel="canonical"\s+href="https:\/\/globaltechevents\.xyz\/?"\s*\/?>/);
assert.equal(getHomeSEO().canonicalUrl, HOME_CANONICAL_HREF);
assert.equal(canonicalHrefForPath('/'), HOME_CANONICAL_HREF);
assert.equal(canonicalHrefForPath('/guides'), null);

const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const catchAllAt = vercel.rewrites.findIndex((rule) => rule.destination === '/index.html');
assert.ok(catchAllAt > 0, 'SPA catch-all');

for (const route of SPA_SHELL_ROUTES) {
  const file = `.${route.path}/index.html`;
  assert.ok(fs.existsSync(file), `${file} must exist so the first response is not the homepage shell`);
  const html = fs.readFileSync(file, 'utf8');
  assert.equal(html, renderSpaRouteShell(indexHtml, route), route.path);
  assert.deepEqual(canonicals(html), [route.href], route.path);
  assert.equal(canonicalHrefForPath(route.path), route.href);
  assert.equal(canonicalHrefForPath(`${route.path}/`), route.href);
  assert.equal(resolveAppRoute(route.path).page, route.path.slice(1));
  assert.equal(resolveAppRoute(`${route.path}/`).page, resolveAppRoute(route.path).page);
  assert.ok(html.includes('<div id="root">'), route.path);
  assert.ok(html.includes('src="/src/main.tsx"'), route.path);
  assert.ok(!html.includes('gte-home-shell'), `${route.path} must not ship the homepage body`);
  for (const source of [route.path, `${route.path}/`]) {
    const rule = vercel.rewrites.find((item) => item.source === source);
    assert.ok(rule, `missing rewrite ${source}`);
    assert.equal(rule.destination, `${route.path}/index.html`);
    assert.ok(vercel.rewrites.indexOf(rule) < catchAllAt, `${source} must be served before the SPA catch-all`);
  }
}

assert.equal(resolveAppRoute('/privacy').page, 'privacy');
assert.equal(resolveAppRoute('/terms/').page, 'terms');
assert.equal(resolveAppRoute('/resources').page, 'resources');

console.log('canonicals ok');
