// plugins/ai-aivideo.js

import fetch from 'node-fetch';
import 'dotenv/config'; // <-- Asegura que se cargue el archivo .env

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `⚠️ *Uso:* ${usedPrefix + command} <texto del video>`, m);

  try {
    let wait = await conn.sendMessage(m.chat, {
      text: '⏳ *Generando tu video con IA, espera un toque...*',
      quoted: m
    });

    const apiKey = process.env.DID_API_KEY; // 🔐 Cargado desde .env

    const body = {
      script: {
        type: "text",
        input: text,
        provider: {
          type: "microsoft",
          voice_id: "es-ES-AlvaroNeural" // Voz en español
        }
      },
      source_url: "https://models.d-id.com/face.jpeg" // Imagen avatar base
    };

    let res = await fetch("https://api.d-id.com/talks", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    let json = await res.json();

    if (!json.id) throw new Error(json.error || "No se pudo crear el video");

    conn.reply(m.chat, `✅ *Video creado:* https://studio.d-id.com/talk/${json.id}`, m);

  } catch (e) {
    console.error(e);
    conn.reply(m.chat, `❌ *Error generando el video:*\n${e.message || e}`, m);
  }
};

handler.help = ['ai-aivideo'];
handler.tags = ['ia'];
handler.command = ['ai-aivideo'];

export default handler;
