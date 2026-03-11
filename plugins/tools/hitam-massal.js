import api from "#izumi/api";
import axios from "axios";
import FormData from "form-data";
const form = new FormData();

export default async function hy(m, {
    conn
}) {
    try {
        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted || {}).mimetype;
        if (!/image/.test(mime)) return m.reply("⚠️ Masukan Gambar / Reply Gambar Buat Hytamkan");

        const media = await quoted.download();
        const { result: re } = await (await api.uploadEnd('/image/hytamkan', { type: "image", buffer: media, mimetype: "image/jpeg" })).data;
        
        await conn.sendMessage(m.chat, {
            image: {
                url: re.download
            },
            caption: `✅ Done Penghitaman Nya`
        }, {
            quoted: m
        });
    } catch (e) {
        m.reply("❌ Gomene Error Mungkin lu kebanyakan request!");
        console.error(e);
    };
};

hy.command = /^(hytamkan|hytam|hitam|hitamkan)$/i;
hy.help = ["hytamkan", "hytam", "hitam", "hitamkan"];
hy.tags = ["tools"];
hy.limit = true;