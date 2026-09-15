function clean(value, max = 120) {
  return String(value ?? "").replace(/[\r\n\t<>]/g, " ").trim().slice(0, max);
}

function escapeHtml(value) {
  return value.replace(/[&<>]/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;"
  }[character]));
}

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const name = clean(data.name, 80);
    const attendance = data.attendance === "yes" ? "ПРИДЁТ" : "НЕ ПРИДЁТ";
    if (!name) {
      return Response.json({ ok: false }, { status: 400 });
    }

    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
      return Response.json({ ok: false, error: "telegram-not-configured" }, { status: 503 });
    }

    const stamp = new Intl.DateTimeFormat("ru-RU", {
      dateStyle: "short",
      timeStyle: "medium",
      timeZone: "Asia/Tashkent"
    }).format(new Date());
    const text = [
      "<b>Новый ответ на приглашение</b>",
      `<b>Имя:</b> ${escapeHtml(name)}`,
      `<b>Ответ:</b> ${attendance}`,
      `<b>Время:</b> ${stamp}`
    ].join("\n");

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text,
          parse_mode: "HTML"
        })
      }
    );

    if (!telegramResponse.ok) {
      return Response.json({ ok: false, error: "telegram-failed" }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
}