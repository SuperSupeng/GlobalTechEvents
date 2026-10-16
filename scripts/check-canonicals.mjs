import assert from 'node:assert/strict';
import fs from 'node:fs';
import { getHomeSEO } from '../src/utils/seo.ts';

const HOME = 'https://www.globaltechevents.xyz/';
const routes = [
  ['/privacy', 'https://www.globaltechevents.xyz/privacy'],
  ['/terms', 'https://www.globaltechevents.xyz/terms'],
  ['/resources', 'https://www.globaltechevents.xyz/resources'],
];

function canonicals(html) {
  return [...html.matchAll(/<link\s+rel="canonical"\s+href="([^"]*)"\s*\/?>/g)].map((match) => match[1]);
}

const indexHtml = fs.readFileSync('index.html', 'utf8');
assert.deepEqual(canonicals(indexHtml), [HOME], 'homepage shell');
assert.doesNotMatch(indexHtml, /https:\/\/globaltechevents\.xyz/);
assert.equal(getHomeSEO().canonicalUrl, HOME);

const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const catchAllAt = vercel.rewrites.findIndex((rule) => rule.destination === '/index.html');
assert.ok(catchAllAt > 0, 'SPA catch-all');

for (const [route, href] of routes) {
  const file = `.${route}/index.html`;
  assert.ok(fs.existsSync(file), `${file} must exist so the first response is not the homepage shell`);
  const html = fs.readFileSync(file, 'utf8');
  assert.deepEqual(canonicals(html), [href], route);
  assert.ok(html.includes('<div id="root">'), route);
  assert.ok(html.includes('src="/src/main.tsx"'), route);
  assert.ok(!html.includes('gte-home-shell'), `${route} must not ship the homepage body`);
  for (const source of [route, `${route}/`]) {
    const rule = vercel.rewrites.find((item) => item.source === source);
    assert.ok(rule, `missing rewrite ${source}`);
    assert.equal(rule.destination, `${route}/index.html`);
    assert.ok(vercel.rewrites.indexOf(rule) < catchAllAt, `${source} must be served before the SPA catch-all`);
  }
}

console.log('canonicals ok');
