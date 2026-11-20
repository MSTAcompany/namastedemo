/* ============================================================================
   Serverless-функция: принимает заявку с формы сайта и шлёт уведомление
   администратору студии в Telegram. Подходит для Netlify / Vercel.

   Зачем: чтобы бот-токен НЕ светился на сайте (он хранится в переменных
   окружения на сервере, а не в config.js).

   Как подключить (коротко, подробно — в README.md):
   1) Создать бота у @BotFather → получить BOT_TOKEN.
   2) Узнать chat_id администратора (напиши боту, потом дёрни
      https://api.telegram.org/bot<TOKEN>/getUpdates и возьми chat.id).
   3) Задать переменные окружения TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID.
   4) В config.js указать booking.endpoint = URL этой функции.

   --- Вариант для Netlify Functions (файл: netlify/functions/telegram-notify.js) ---
   ========================================================================== */

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  if (!TOKEN || !CHAT_ID) {
    return { statusCode: 500, body: "Not configured" };
  }

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: "Bad JSON" };
  }

  // Простая защита от пустых/спам-заявок
  if (!data.name || !data.phone) {
    return { statusCode: 400, body: "Missing fields" };
  }

  const text =
    `🧘 Новая заявка на пробное (${data.studio || "студия"})\n\n` +
    `Имя: ${data.name}\n` +
    `Телефон: ${data.phone}\n` +
    `Направление: ${data.direction || "любое"}\n` +
    `Комментарий: ${data.comment || "—"}`;

  const resp = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text }),
  });

  if (!resp.ok) {
    return { statusCode: 502, body: "Telegram error" };
  }

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ ok: true }),
  };
};

/* --- Вариант для Vercel (файл: api/telegram-notify.js) ---
   Экспортируй так вместо exports.handler:

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  const data = req.body;
  if (!data?.name || !data?.phone) return res.status(400).send("Missing fields");
  const text = `Новая заявка (${data.studio}): ${data.name}, ${data.phone}, ${data.direction || "любое"}`;
  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text }),
  });
  return r.ok ? res.status(200).json({ ok: true }) : res.status(502).send("Telegram error");
}
*/
