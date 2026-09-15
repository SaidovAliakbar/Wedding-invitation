export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/rsvp" && request.method === "POST") {
      try {
        const body = await request.json();

        const name = String(body.name || "").trim();
        const attendance = String(body.attending || "").trim();

        if (!name || !["yes", "no"].includes(attendance)) {
          return Response.json(
            {
              ok: false,
              error: "Invalid form data"
            },
            { status: 400 }
          );
        }

        await env.RSVP_DB
          .prepare(`
            INSERT INTO rsvps (name, attendance)
            VALUES (?, ?)
          `)
          .bind(name, attendance)
          .run();

        return Response.json({ ok: true });
      } catch (error) {
        console.error("RSVP error:", error);

        return Response.json(
          {
            ok: false,
            error: "Server error"
          },
          { status: 500 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};