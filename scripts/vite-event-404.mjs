import fs from 'node:fs';
import path from 'node:path';

const SPA_SHELL_ROUTE = /^\/(privacy|terms|resources)\/?$/;

const FALLBACK_NOT_FOUND_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <title>Page not found | GlobalTechEvents</title>
  </head>
  <body>
    <h1>Page not found</h1>
    <p>That address is not a page on this site.</p>
    <p><a href="/">Back to the calendar</a> · <a href="/events">Events directory</a></p>
  </body>
</html>`;

function safePath(root, ...segments) {
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

function loadNotFound(root) {
  const file = safePath(root, '404.html');
  if (file && fs.existsSync(file) && fs.statSync(file).isFile()) return fs.readFileSync(file);
  return FALLBACK_NOT_FOUND_HTML;
}

function rewriteSpaShell(req) {
  const [pathname, query] = (req.url || '').split('?');
  const match = pathname.match(SPA_SHELL_ROUTE);
  if (!match) return false;
  req.url = `/${match[1]}/index.html${query ? `?${query}` : ''}`;
  return true;
}

function isViteInternal(pathname) {
  return (
    pathname.startsWith('/src/') ||
    pathname.startsWith('/@') ||
    pathname.startsWith('/node_modules/') ||
    pathname.startsWith('/__vite')
  );
}

const STATIC_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.json': 'application/json; charset=utf-8',
};

function resolvePublicFile(root, pathname) {
  let decoded = pathname;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  if (decoded.includes('\0')) return null;
  const rel = decoded.replace(/^\/+/, '').replace(/\/+$/, '');
  if (!rel) return null;
  const file = safePath(root, rel);
  const index = safePath(root, rel, 'index.html');
  if (index && fs.existsSync(index) && fs.statSync(index).isFile()) return index;
  if (file && fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  return null;
}

function sendFile(res, file) {
  const type = STATIC_TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
  res.statusCode = 200;
  res.setHeader('Content-Type', type);
  fs.createReadStream(file).pipe(res);
}

function eventShellMiddleware(root) {
  const notFound = loadNotFound(root);
  return (req, res, next) => {
    if (rewriteSpaShell(req)) {
      next();
      return;
    }
    const pathname = (req.url || '').split('?')[0];
    if (pathname === '/' || pathname === '/index.html' || isViteInternal(pathname)) {
      next();
      return;
    }
    const file = resolvePublicFile(root, pathname);
    if (file) {
      sendFile(res, file);
      return;
    }
    sendHtml(res, 404, notFound);
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
