import {
    Sticker,
    createSticker,
    StickerTypes
} from "wa-sticker-formatter";
import up from "#library/uploader.js";
import axios from "axios";
import fs from "fs";

let handler = async (m, {
    conn,
    usedPrefix,
    command,
    text,
}) => {
    try {
        let quoted = m.quoted ? m.quoted : m;
        let mime = quoted?.msg?.mimetype || quoted?.mimetype || "";

        if (!/image/.test(mime)) return m.reply(` *– 乂 Cara Pakai Nih Fitur ${usedPrefix + command}*
  々 Atas: ${usedPrefix + command} --atas text | kirim gambar / reply gambar 
  々 Bawah: ${usedPrefix + command} --bawah text | kirim gambar / reply gambar 
  々 Bersama: ${usedPrefix + command} textAtas | textBawah | kirim gambar / reply gambar `)
        let media = await quoted.download();
        let tempfiles = await up.tempfiles(media);

        let payload;
        if (text.includes("--atas")) {
            const match = text.match(/^--atas\s+(.+)/i);
            const hasil = match ? match[1] : "";
            if (!hasil) return m.reply("⚠️Masukan Teks Nya Buat Di Atas!");

            payload = {
                background: tempfiles,
                style: "string",
                text: [
                    hasil,
                    ""
                ],
                layout: "string",
                font: "string",
                extension: "string",
                redirect: true
            }
        } else if (text.includes("--bawah")) {
            const match = text.match(/^--bawah\s+(.+)/i);
            const hasil = match ? match[1] : "";
            if (!hasil) return m.reply("⚠️Masukan Teks Nya Buat Di Bawah!");

            payload = {
                background: tempfiles,
                style: "string",
                text: [
                    "",
                    hasil
                ],
                layout: "string",
                font: "string",
                extension: "string",
                redirect: true
            }
        } else if (text.includes(' | ')) {
            const [atas, bawah] = text.split(" | ");
            if (!atas && !bawah) return m.reply("⚠️ Masukan Teks Bersamaan Atas Sama Bawah!")

            payload = {
                background: tempfiles,
                style: "string",
                text: [
                    atas,
                    bawah
                ],
                layout: "string",
                font: "string",
                extension: "string",
                redirect: true
            }
        } else {
            return m.reply(` *– 乂 Cara Pakai Nih Fitur ${usedPrefix + command}*
  々 Atas: ${usedPrefix + command} --atas text | kirim gambar / reply gambar 
  々 Bawah: ${usedPrefix + command} --bawah text | kirim gambar / reply gambar 
  々 Bersama: ${usedPrefix + command} textAtas | textBawah | kirim gambar / reply gambar`)
        }

        if (!payload) return;
        const {
            data
        } = await axios.post('https://api.memegen.link/images/custom', payload, {
            responseType: "arraybuffer"
        });

        let st = {
            pack: `╭───── ( ${global?.botname} ) ─────
│ -(AUTHOR)-: ${global?.ownername}
│ -(WEB)-: ${global?.web}
╰──────────────`
        };

        const sticker = new Sticker(data, {
            ...st,
            type: StickerTypes.FULL,
            categories: ['🫩'],
            id: Date.now(),
            quality: 50,
            background: '#000000'
        })

        const buffer = await sticker.toBuffer();
        await sticker.toFile('sticker.webp');

        conn.sendMessage(m.chat, await sticker.toMessage(), {
            quoted: m
        });
        await fs.unlinkSync('sticker.webp')
    } catch (e) {
        m.reply("❌ Gomene Error Mungkin lu kebanyakan request");
        console.error(e);
    };
};

handler.help = handler.command = ["smeme", "sticker-meme"];
handler.tags = ["sticker"];
handler.limit = true;

export default handler
