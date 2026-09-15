# Wedding invitation — Cloudflare Pages + D1

Статический свадебный сайт без build step и без server-side Node.js.

## Cloudflare Pages

- Framework: None
- Build command: оставить пустым
- Build output directory: `.`
- Root directory: `/`
- Deploy command: оставить пустым
- Version command: оставить пустым

Папка `functions/` автоматически используется как Pages Functions.

## D1

Создайте Pages Function binding:

- Variable name: `RSVP_DB`
- Resource: ваша D1 database

Затем выполните `schema.sql` в этой базе.

Endpoint формы: `POST /api/rsvp`.

Локально статическую часть можно открыть через любой локальный HTTP-сервер, например `python3 -m http.server 8080`.
