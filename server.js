const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const GUESTS = path.join(ROOT, "guests.txt");

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

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/rsvp") {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 20000) req.destroy();
    });
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const name = clean(data.name, 80);
        const attendance = data.attendance === "yes" ? "ПРИДЁТ" : "НЕ ПРИДЁТ";
        if (!name) throw new Error("bad-name");
        const stamp = new Intl.DateTimeFormat("ru-RU", {
          dateStyle: "short", timeStyle: "medium", timeZone: "Asia/Tashkent"
        }).format(new Date());
        fs.appendFileSync(GUESTS, `${stamp} | ${name} | ${attendance}\n`, "utf8");
        res.writeHead(200, {"Content-Type":"application/json; charset=utf-8"});
        res.end(JSON.stringify({ok:true}));
      } catch {
        res.writeHead(400, {"Content-Type":"application/json; charset=utf-8"});
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
