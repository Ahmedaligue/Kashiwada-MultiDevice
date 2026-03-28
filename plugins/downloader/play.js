import convert from "#library/toAll.js";
import axios from "axios";
import api from "#izumi/api";
let Izumi = async (m, {
    conn,
    text
}) => {
    if (!text) return m.reply('⚠️ Masukan Nama Lagu Yang Ini Anda Cari !')
    try {
        let resp =await api.get('/downloader/youtube/play?query=' + encodeURIComponent(text), { type: 'result' })
        const thx = `🇻🇪 Done Play Music
> *(+)* Api From ${resp.baseURL}`
        const play = resp.result;
        const {
            data: toBuffer
        } = await axios.get(play.download, {
            responseType: 'arraybuffer'
        });
        if (toBuffer.length > 1024 * 1024 * 50) {
            await conn.sendMessage(m.chat, {
                document: toBuffer,
                fileName: play.title + ".mp3",
                mimetype: 'audio/mpeg',
                caption: thx
            }, {
                quoted: m
            });
        } else {
            const vnRe = await sendWhatsAppVoice(conn, m.chat, toBuffer, {
                fileName: play.filename,
            }, {
                quoted: m
            });
            conn.reply(m.chat, thx, vnRe)
        }
    } catch (e) {
        m.reply(' ❌ Maaf Error Mungkin lu kebanyakan request');
        console.error('Error', e);
    };
};
async function toWhatsAppVoice(inputBuffer) {
    const audioBuffer = await convert.toVN(inputBuffer)
    const waveform = await convert.generateWaveform(audioBuffer)
    return {
        audio: audioBuffer,
        waveform
    }
}
async function sendWhatsAppVoice(conn, chatId, inputBuffer, options = {}, options2 = {}) {
    try {
        const {
            audio,
            waveform
        } = await toWhatsAppVoice(inputBuffer)
        return conn.sendMessage(chatId, {
            audio: audio,
            waveform: waveform,
            mimetype: "audio/ogg; codecs=opus",
            ptt: true,
            ...options,
        }, {
            ...options2
        })
    } catch (err) {
        console.error("Failed to send voice:", err)
    }
}
Izumi.command = Izumi.help = ["play", "music-", "musik"];
Izumi.tags = ["downloader"];
Izumi.limit = true;
export default Izumi;
