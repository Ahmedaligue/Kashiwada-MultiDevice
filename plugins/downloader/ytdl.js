import axios from "axios";
import api from "#izumi/api";
let Izumi = async (m, {
    conn,
    text,
    command
}) => {
    try {
        switch (command) {
            case "ytmp4": {
                if (!text.includes('youtu')) return m.reply('⚠️ Masukan Link YouTube Sama Format !')
                let [link, format] = text.split(' ')
                const f = format || "360"
                const quality = ['360', '720', '1080']
                if (!quality.includes(f)) return m.reply(' ⚠️Quality Tersedia Hanya: ' + format.video.map((a => a)).join(', '))
                const params = {
                    url: link,
                    format: f
                };
                let resp = await api.get('/downloader/youtube', { params, type: 'result' })
                const thx = `🇻🇪 Done Downloader Youtube
> *(+)* Fixed From ${resp.baseURL}`
                const yt = resp.result;
                const buffer = await axios.get(yt.download, { responseType: 'arraybuffer' });
                if (buffer.data.length > 1024 * 1024 * 30) {
                    await conn.sendMessage(m.chat, {
                        document: buffer.data,
                        fileName: encodeURIComponent(yt.title) + '.mp4',
                        mimetype: 'video/mp4',
                        caption: thx
                    }, {
                        quoted: m
                    });
                } else {
                    const resc = await con.converter(buffer.data, 'webp', 'mp4')
                    await conn.sendMessage(m.chat, {
                        video: buffer.data,
                        caption: thx
                    }, {
                        quoted: m
                    });
                }
            }
            break;
            case "ytmp3": {
                if (!text.includes('youtu')) return m.reply('⚠️ Masukan Link Youtube')
                const params = {
                    url: text,
                    format: 'mp3'
                };
                let resp = await api.get('/downloader/youtube', { params, type: 'result' })
                const thx = `🇻🇪 Done Downloader Youtube
> *(+)* Fixed From ${resp.baseURL}`
                const yt = resp.result;
                const buffer = await axios.get(yt.download, { responseType: 'arraybuffer' });
                if (buffer.data.length > 1024 * 1024 * 100) {
                    await conn.sendMessage(m.chat, {
                        document: buffer.data,
                        fileName: encodeURIComponent(yt.title) + '.mp3',
                        mimetype: 'audio/mpeg',
                        caption: thx
                    }, {
                        quoted: m
                    });
                } else {
                    const reply = await conn.sendMessage(m.chat, {
                        audio: buffer.data,
                        mimetype: 'audio/mpeg'
                    }, {
                        quoted: m
                    });
                    conn.reply(m.chat, thx, reply)
                }
            }
            break;
        };
    } catch (e) {
        m.reply(' ❌ Maaf Error Mungkin lu kebanyakan request');
        console.error('Error', e);
    };
};
Izumi.command = Izumi.help = ["ytmp4", "ytmp3"];
Izumi.tags = ["downloader"];
Izumi.limit = true;
export default Izumi;
