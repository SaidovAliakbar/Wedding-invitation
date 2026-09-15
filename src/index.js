const SESSION_COOKIE = "admin_session";
const SESSION_TTL = 60 * 60 * 12;

function json(data, init = {}) {
  return Response.json(data, {
    ...init,
    headers: {
      ...(init.headers || {}),
      "Cache-Control": "no-store",
    },
  });
}

function base64url(bytes) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64url(s) {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  return Uint8Array.from(bin, c => c.charCodeAt(0));
}

async function hmac(secret, value) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
}

async function createSession(secret) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL;
  const payload = `${exp}`;
  const sig = base64url(await hmac(secret, payload));
  return `${payload}.${sig}`;
}

async function validSession(request, secret) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  if (!match) return false;
  const [exp, sig] = match[1].split(".");
  if (!exp || !sig || Number(exp) < Math.floor(Date.now() / 1000)) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  return crypto.subtle.verify("HMAC", key, fromBase64url(sig), new TextEncoder().encode(exp));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/rsvp" && request.method === "POST") {
      try {
        const body = await request.json();
        const name = String(body.name || "").trim();
        const attendance = String(body.attending || "").trim();

        if (name.length < 2 || name.length > 80 || !["yes", "no"].includes(attendance)) {
          return json({ ok: false, error: "Invalid form data" }, { status: 400 });
        }

        await env.RSVP_DB
          .prepare("INSERT INTO rsvps (name, attendance) VALUES (?, ?)")
          .bind(name, attendance)
          .run();

        return json({ ok: true });
      } catch (error) {
        console.error("RSVP error", error);
        return json({ ok: false, error: "Server error" }, { status: 500 });
      }
    }

    if (url.pathname === "/api/admin/login" && request.method === "POST") {
      try {
        const body = await request.json();
        if (!env.ADMIN_PASSWORD || String(body.password || "") !== env.ADMIN_PASSWORD) {
          return json({ ok: false, error: "Unauthorized" }, { status: 401 });
        }
        const token = await createSession(env.ADMIN_PASSWORD);
        return json(
          { ok: true },
          {
            headers: {
              "Set-Cookie": `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${SESSION_TTL}; HttpOnly; Secure; SameSite=Strict`,
            },
          }
        );
      } catch {
        return json({ ok: false, error: "Bad request" }, { status: 400 });
      }
    }

    if (url.pathname === "/api/admin/logout" && request.method === "POST") {
      return json(
        { ok: true },
        { headers: { "Set-Cookie": `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict` } }
      );
    }

    if (url.pathname === "/api/admin/rsvps" && request.method === "GET") {
      if (!env.ADMIN_PASSWORD || !(await validSession(request, env.ADMIN_PASSWORD))) {
        return json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
      }

      try {
        const result = await env.RSVP_DB
          .prepare("SELECT id, name, attendance, created_at FROM rsvps ORDER BY id DESC")
          .all();
        const rows = result.results || [];
        const yes = rows.filter(row => row.attendance === "yes").length;
        const no = rows.filter(row => row.attendance === "no").length;
        return json({ ok: true, total: rows.length, yes, no, rows });
      } catch (error) {
        console.error("Admin list error", error);
        return json({ ok: false, error: "Database error" }, { status: 500 });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
