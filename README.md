# Aziza & Ravshan — Wedding Invitation v2

Обновлённая версия: editorial / royal serif, тёплая ivory-палитра, объёмные embossed-узоры, liquid-glass элементы, современный desktop-контейнер и рабочий RSVP через Node.js.

## Запуск RSVP

Требуется Node.js 18+:

```bash
npm start
```

Открыть http://localhost:3000

При отправке RSVP ответ приходит в Telegram через Bot API. Файл `guests.txt` больше не используется.

Перед запуском задайте переменные окружения:

```powershell
$env:TELEGRAM_BOT_TOKEN = "токен_бота_от_BotFather"
$env:TELEGRAM_CHAT_ID = "ваш_chat_id"
npm start
```

`api_id` и `api_hash` Telegram-клиента для Bot API не нужны. Их нельзя хранить в проекте или публиковать.

### Почему иногда RSVP "не работает"

Не открывайте `index.html` двойным кликом через `file://`: браузер не сможет обратиться к `/api/rsvp`.
Запускайте через `npm start` / `node server.js`.

Если Telegram не настроен или недоступен, сервер вернёт ошибку, чтобы ответ не потерялся незаметно.

## Деплой на Cloudflare Pages

Cloudflare Pages не запускает `server.js`. Для RSVP используется Pages Function `functions/api/rsvp.js`.

В настройках проекта Cloudflare Pages добавьте Secrets/Environment variables для Production:

- `TELEGRAM_BOT_TOKEN` — токен бота от BotFather
- `TELEGRAM_CHAT_ID` — ID чата, куда бот отправляет ответы

После публикации форма продолжит обращаться к `/api/rsvp`, а Cloudflare автоматически направит запрос в Pages Function.

Для ручного деплоя Pages используйте:

```bash
npx wrangler pages deploy . --project-name wedding-invitation
```

Не используйте `wrangler deploy`: это деплой Worker, а данный проект является Cloudflare Pages-проектом.

## Данные свадьбы

- Азиза & Равшан
- 04.10.2026
- Omad, Ургенч
- начало: 18:00 (Asia/Tashkent)

Время countdown меняется в `script.js`:
`new Date("2026-10-04T18:00:00+05:00")`

## Дизайн

Основная композиция намеренно не заполняет страницу "карточками ради карточек": каждая секция работает как отдельный разворот приглашения — hero, бумажное письмо, стеклянный блок деталей, countdown и RSVP-card.

## V3 inspiration
Визуальный апгрейд опирается на актуальные свадебные stationery-приёмы: navy/ivory botanical crest, декоративные wreath/monogram, blind-embossing и плотные орнаментальные рамки. Для первой страницы сохранён крупный floral hero, а тёмные страницы теперь получили кремовые свадебные орнаменты и герб.

## V4
- Убран набор SaaS-похожих карточек из секции важного дня.
- Вместо них — центральная королевская plaque-композиция с гербом, датой, местом и временем.
- Вторая страница вокруг бумажного листа получила дополнительные орнаменты и рамки.
- Подпись `Ravshanbek & Aziza` переведена на декоративный свадебный script-шрифт.
- Для desktop добавлена лёгкая pointer-tilt анимация главной royal plaque.

## V5
- Шрифтовая система стала более свадебной: DM Serif Display для крупных титулов и Great Vibes/Ballet для рукописных акцентов.
- Месяц в датах локализуется: OKTYABR / ОКТЯБРЯ / OCTOBER.
- Дата отображается как `4 OKTYABR 2026`, без тяжёлого цифрового `04.10`.
- Reveal-анимации перестроены на последовательное появление родителя и декора, чтобы элементы не выезжали друг на друга.
- На мобильных декоративные элементы уменьшены и разведены от центральной royal plaque.

## V6
- Groom name is now `Ravshanbek` everywhere.
- Hero uses Bodoni Moda for a stronger couture/royal serif appearance.
- Month is no longer rendered in an oversized script: `OKTYABR / ОКТЯБРЯ / OCTOBER` is a compact high-contrast serif italic.
- Date layout was separated into number / month / year to prevent overlap with the stationery mockup.

## V7
- На первую страницу добавлена объёмная embossed vintage-frame композиция по четырём углам и по периметру.
- Добавлен внутренний glow-ring и двойной рельефный слой рамки.
- Для каллиграфических акцентов вместо Ballet/Great Vibes используется Parisienne; основные имена остаются на Cormorant Garamond.
- Декоративные элементы первой страницы усилены тенями и бликами для ощущения тиснения.

## V8
- Русский режим теперь показывает имена кириллицей: `Равшанбек & Азиза`.
- Имена в русском режиме становятся курсивными.
- Плавающие инициалы `R & A` возле hero-текста удалены.
- Английский/узбекский режим сохраняют латиницу.

## V9
- Используется приложенный пользователем `Runethia.otf` для латинского декоративного текста.
- Runethia не содержит кириллицу, поэтому для русской версии используется близкий по характеру `Marck Script` с кириллицей; при этом все декоративные роли получают один и тот же типографический treatment.
- На первой странице убраны боковые цветочные узоры; оставлена и усилена только объёмная винтажная рамка по краям.
- Русский режим: `Равшанбек & Азиза`.
- Узбекский/английский режим: `Ravshanbek & Aziza`.
