export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/rsvp" && request.method === "POST") {
      try {
        const body = await request.json();

        const { name, guests, attending, message } = body;

        if (!name || !attending) {
          return Response.json(
            { ok: false, error: "Missing required fields" },
            { status: 400 }
          );
        }

        await env.RSVP_DB
          .prepare(`
            INSERT INTO rsvps (name, guests, attending, message)
            VALUES (?, ?, ?, ?)
          `)
          .bind(
            name,
            Number(guests || 1),
            attending,
            message || ""
          )
          .run();

        return Response.json({ ok: true });
      } catch (error) {
        return Response.json(
          { ok: false, error: "Server error" },
          { status: 500 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  },
};