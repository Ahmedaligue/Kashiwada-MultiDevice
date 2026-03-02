import up from "@izumi/uploader";
import api from "@izumi/api";
import axios from "axios";
import FormData from "form-data";
const form = new FormData();
        
let handler = async (m, {
    conn,
    usedPrefix,
    command
}) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = q?.msg?.mimetype || q?.mimetype || "";

        if (!/image/.test(mime)) return m.reply(`⚠️ Reply Gambar / Kirim Gambar Caption Buat ${usedPrefix + command}`);

        const media = await q.download();
        form.append("image", media, {
            filename: "removebg-" + Date.now() + ".jpg",
            contentType: "image/jpeg"
        });

        const { result: re } = await (await api.post('/tools/removebg', form, { headers: { ...form.getHeaders() } })).data;

        await conn.sendMessage(m.chat, {
            image: {
                url: re
            },
            caption: ` 📷 Remove Background Gambar\n\n 🔗Url: ${re || ""}`
        }, {
            quoted: m
        })
    } catch (e) {
        m.reply("❌ Gomene Error Mungkin lu kebanyakan request");
        console.error(e);
    };
};

handler.help = handler.command = ["removebg", "rbg", "removebackground"];
handler.tags = ["tools"];
handler.limit = true;

export default handler;
