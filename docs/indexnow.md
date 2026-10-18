# IndexNow

Ownership key for `https://www.globaltechevents.xyz`, so Bing, Yandex, and other IndexNow engines can be notified at `https://api.indexnow.org`.

The key file is meant to be public at the site root. Do not put the key in `robots.txt`, and do not copy it into other secret stores. Do not submit IndexNow from CI; submit URLs manually when they change.

## Key

- Key: `7b3e8e8c-65fb-4d06-9a5e-9de3232ce1a6`
- File: `public/7b3e8e8c-65fb-4d06-9a5e-9de3232ce1a6.txt` (UTF-8 text; the body is the key)
- Public URL: `https://www.globaltechevents.xyz/7b3e8e8c-65fb-4d06-9a5e-9de3232ce1a6.txt`

`vercel.json` serves root `*.txt` (this key, `robots.txt`, `llms.txt`) as the static file. Those paths are excluded from the SPA catch-all that rewrites unknown routes to `index.html`, and the key URL is sent as `text/plain; charset=utf-8`.

## Submit one URL

`GET https://api.indexnow.org/indexnow?url=<url-encoded>&key=<key>`

```bash
curl -sS "https://api.indexnow.org/indexnow?url=https%3A%2F%2Fwww.globaltechevents.xyz%2F&key=7b3e8e8c-65fb-4d06-9a5e-9de3232ce1a6"
```

## Submit a set of URLs

`POST https://api.indexnow.org/indexnow` with JSON `{ "host": "www.globaltechevents.xyz", "key": "...", "urlList": [...] }`.

```bash
curl -sS -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{
    "host": "www.globaltechevents.xyz",
    "key": "7b3e8e8c-65fb-4d06-9a5e-9de3232ce1a6",
    "urlList": [
      "https://www.globaltechevents.xyz/",
      "https://www.globaltechevents.xyz/events"
    ]
  }'
```

`keyLocation` is optional when the key file is already at `https://www.globaltechevents.xyz/<key>.txt`.
