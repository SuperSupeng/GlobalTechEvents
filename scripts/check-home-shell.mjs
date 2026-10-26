import assert from 'node:assert/strict';
import fs from 'node:fs';
import { renderHomeShell } from './generate-hub-static.mjs';

const guides = [
  { slug: 'best-ai-conferences-2026', title: 'Best AI conferences 2026' },
];

function assertCrawlableShell(html, label) {
  assert.match(
    html,
    /<h1[^>]*>The 2026 global tech events calendar — subscribe once<\/h1>/,
    `${label} must keep the home H1 in the HTML`,
  );
  for (const href of ['/events', '/guides', '/resources', '/for-agents', '/events/openai-devday-2026']) {
    assert.ok(html.includes(`href="${href}"`), `${label} must keep href="${href}" in the HTML`);
  }
}

function assertHiddenBeforeParseWhenScripting(html, label) {
  const mainAt = html.indexOf('<main id="gte-home-shell"');
  assert.ok(mainAt !== -1, `${label} is missing #gte-home-shell`);
  const beforeMain = html.slice(0, mainAt);
  assert.match(
    beforeMain,
    /<style>#gte-home-shell\{display:none\}<\/style>/,
    `${label} must hide #gte-home-shell before the element is parsed`,
  );
  assert.match(
    beforeMain,
    /<noscript><style>#gte-home-shell\{display:block !important\}<\/style><\/noscript>/,
    `${label} must show #gte-home-shell when scripting is disabled`,
  );
}

function assertOtherRoutesStillStripShell(html, label) {
  assert.match(
    html,
    /if \(location\.pathname !== '\/' && location\.pathname !== ''\) \{\s*document\.getElementById\('gte-home-shell'\)\?\.remove\(\);\s*\}/,
    `${label} must still remove the home shell off /`,
  );
}

const generated = renderHomeShell(guides);
assertCrawlableShell(generated, 'renderHomeShell');
assertHiddenBeforeParseWhenScripting(generated, 'renderHomeShell');
assertOtherRoutesStillStripShell(generated, 'renderHomeShell');
assert.ok(
  generated.includes('href="/guides/best-ai-conferences-2026"'),
  'renderHomeShell must include live guide links',
);

const indexHtml = fs.readFileSync('index.html', 'utf8');
assertCrawlableShell(indexHtml, 'index.html');
assertHiddenBeforeParseWhenScripting(indexHtml, 'index.html');
assertOtherRoutesStillStripShell(indexHtml, 'index.html');

console.log('home shell: crawlable HTML, hidden before JS paint, stripped off /');
