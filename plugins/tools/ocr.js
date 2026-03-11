import api from "#izumi/api";

let oota = async (m, {
    text
}) => {
    try {
        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted || {}).mimetype || "";
        if (!/image/.test(mime)) return m.reply("⚠️Masukan Gambar Buat Copy Text Di Gambar!");
        const media = await quoted.download();
        const { result: re } = await (await api.uploadEnd('/tools/ocr', { type: "image", buffer: media, mimetype: "image/jpeg" })).data;
        
        await m.reply(result);
    } catch (e) {
        m.reply("❌ Gomene Error Mungkin lu kebanyakan request");
        console.error(e);
    };
};

oota.command = /^(ocr)$/i;
oota.help = ["ocr"];
oota.tags = ["tools"];
oota.limit = true;

export default oota;
