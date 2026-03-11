import api from "#izumi/api";

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
        const { result: re } = await (await api.uploadEnd('/tools/upscale', { type: "image", buffer: media, mimetype: "image/jpeg" })).data;
        
        const size = await Func.getSize(re?.imageUrl);
        await conn.sendMessage(m.chat, {
            image: {
                url: re.imageUrl
            },
            caption: ` 📷 Remini Gambar\n\n 🔗Url: ${re?.imageUrl || ""}\n ☘️Size: ${size || ""}`
        }, {
            quoted: m
        })
    } catch (e) {
        m.reply("❌ Gomene Error Mungkin lu kebanyakan request");
        console.error(e);
    };
};

handler.help = handler.command = ["hd", "remini", "hdr"];
handler.tags = ["tools"];
handler.limit = true;

export default handler;