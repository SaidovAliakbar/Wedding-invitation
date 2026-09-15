const MAX_BODY_SIZE = 10_000;
const MAX_NAME_LENGTH = 80;

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    "content-type": "application/json; charset=UTF-8",
    "cache-control": "no-store"
  }
});

const cleanName = (value) => String(value ?? "")
  .normalize("NFKC")
  .replace(/\s+/g, " ")
  .trim()
  .slice(0, MAX_NAME_LENGTH);

export async function onRequestPost(context) {
  const db = context.env?.RSVP_DB;
  if (!db) return json({ ok: false, error: "RSVP_DB is not configured." }, 503);

  const length = Number(context.request.headers.get("content-length") || 0);
  if (length > MAX_BODY_SIZE) return json({ ok: false, error: "Request too large." }, 413);

  let body;
  try {
    const raw = await context.request.text();
    if (raw.length > MAX_BODY_SIZE) return json({ ok: false, error: "Request too large." }, 413);
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "Invalid JSON." }, 400);
  }

  const name = cleanName(body?.name);
  const attendance = body?.attendance === "yes" ? "yes" : body?.attendance === "no" ? "no" : null;

  if (name.length < 2 || !attendance) {
    return json({ ok: false, error: "Invalid RSVP data." }, 400);
  }

  try {
    await db
      .prepare("INSERT INTO rsvps (name, attendance) VALUES (?, ?)")
      .bind(name, attendance)
      .run();

    return json({ ok: true });
  } catch (error) {
    console.error("D1 RSVP insert failed", error);
    return json({ ok: false, error: "Database error." }, 500);
  }
}

export async function onRequest(context) {
  return json({ ok: false, error: "Method not allowed." }, 405);
}
