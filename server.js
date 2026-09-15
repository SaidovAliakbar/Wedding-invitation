const http = require("http");
const https = require("https");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const mime = {
  ".html":"text/html; charset=utf-8",
  ".css":"text/css; charset=utf-8",
  ".js":"application/javascript; charset=utf-8",
  ".svg":"image/svg+xml; charset=utf-8",
  ".png":"image/png",
  ".ttf":"font/ttf",
  ".txt":"text/plain; charset=utf-8"
};

function clean(v, max=120) {
  return String(v ?? "").replace(/[\r\n\t<>]/g, " ").trim().slice(0,max);
}

function escapeTelegram(value) {
  return value.replace(/[&<>]/g, character => ({"&":"&amp;", "<":"&lt;", ">":"&gt;"}[character]));
}

function sendTelegramMessage(text) {
  return new Promise((resolve, reject) => {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      reject(new Error("telegram-not-configured"));
      return;
    }

    const payload = JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: "HTML"
    });
    const request = https.request({
      hostname: "api.telegram.org",
      path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload)
      }
    }, response => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", chunk => { body += chunk; });
      response.on("end", () => {
        if (response.statusCode !== 200) {
          reject(new Error(`telegram-http-${response.statusCode}`));
          return;
        }
        try {
          const result = JSON.parse(body);
          if (!result.ok) throw new Error("telegram-rejected");
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
    request.setTimeout(8000, () => request.destroy(new Error("telegram-timeout")));
    request.on("error", reject);
    request.end(payload);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/rsvp") {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 20000) req.destroy();
    });
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        const name = clean(data.name, 80);
        const attendance = data.attendance === "yes" ? "ПРИДЁТ" : "НЕ ПРИДЁТ";
        if (!name) throw new Error("bad-name");
        const stamp = new Intl.DateTimeFormat("ru-RU", {
          dateStyle: "short", timeStyle: "medium", timeZone: "Asia/Tashkent"
        }).format(new Date());
        await sendTelegramMessage(
          `<b>Новый ответ на приглашение</b>\n` +
          `<b>Имя:</b> ${escapeTelegram(name)}\n` +
          `<b>Ответ:</b> ${attendance}\n` +
          `<b>Время:</b> ${stamp}`
        );
        res.writeHead(200, {"Content-Type":"application/json; charset=utf-8"});
        res.end(JSON.stringify({ok:true}));
      } catch (error) {
        console.error("RSVP notification failed:", error.message);
        const status = error.message === "bad-name" ? 400 : 502;
        res.writeHead(status, {"Content-Type":"application/json; charset=utf-8"});
        res.end(JSON.stringify({ok:false}));
      }
    });
    return;
  }

  let url = decodeURIComponent(req.url.split("?")[0]);
  if (url === "/") url = "/index.html";
  const filename = path.normalize(path.join(ROOT, url));

  if (!filename.startsWith(ROOT)) {
    res.writeHead(403); return res.end("Forbidden");
  }

  fs.readFile(filename, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, {"Content-Type": mime[path.extname(filename)] || "application/octet-stream"});
    res.end(data);
  });
});

server.listen(PORT, () => console.log(`Aziza & Ravshan: http://localhost:${PORT}`));
