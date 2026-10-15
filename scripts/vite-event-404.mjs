import fs from 'node:fs';
import path from 'node:path';

const EVENT_SLUG = /^\/events\/([^/]+)\/?$/;
const SHELL_PATH = /^\/(cities|tracks)\/([^/]+)\/?$/;

const NOT_FOUND_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <title>Event not found | GlobalTechEvents</title>
  </head>
  <body>
    <h1>Event not found</h1>
    <p>No event page exists for this address.</p>
    <p><a href="/events">All events</a></p>
  </body>
</html>`;

function safeIndexFile(root, ...segments) {
  const base = path.resolve(root);
  const file = path.resolve(base, ...segments);
  if (file !== base && !file.startsWith(base + path.sep)) return null;
  return file;
}

function sendHtml(res, status, html) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  if (status === 404) res.setHeader('X-Robots-Tag', 'noindex');
  res.end(html);
}

function eventShellMiddleware(root) {
  return (req, res, next) => {
    const pathname = (req.url || '').split('?')[0];
    const shellMatch = pathname.match(SHELL_PATH);
    if (shellMatch) {
      const file = safeIndexFile(root, shellMatch[1], shellMatch[2], 'index.html');
      if (file && fs.existsSync(file)) {
        sendHtml(res, 200, fs.readFileSync(file));
        return;
      }
      next();
      return;
    }

    const eventMatch = pathname.match(EVENT_SLUG);
    if (!eventMatch) {
      next();
      return;
    }

    let slug = eventMatch[1];
    try {
      slug = decodeURIComponent(slug);
    } catch {
      next();
      return;
    }

    const file = safeIndexFile(root, 'events', slug, 'index.html');
    if (file && fs.existsSync(file)) {
      next();
      return;
    }

    sendHtml(res, 404, NOT_FOUND_HTML);
  };
}

export function eventShell404Plugin() {
  return {
    name: 'event-shell-404',
    configureServer(server) {
      server.middlewares.use(eventShellMiddleware(path.resolve('public')));
    },
    configurePreviewServer(server) {
      server.middlewares.use(eventShellMiddleware(path.resolve('dist')));
    },
  };
}
