import os from "node:os";
import fs from "node:fs";
import path from 'path';
import {
    fileURLToPath
} from 'url';
let num = "13135550002@s.whatsapp.net";
import convert from "#library/toAll.js";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pluginFolder = path.join(__dirname, '../plugins');
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

let handler = async (m, {
    conn,
    text,
    isROwner,
    usedPrefix,
    command
}) => {

    async function loadPlugins() {
        const fileAll = Object.keys(pg.plugins);

        const pluginFile = []
        for (let fold of fileAll) {
            if (!fold.endsWith('.js')) continue
            const plu = pg.plugins[fold]
            pluginFile.push(plu)
        }

        return pluginFile
    };

    const plugins = await loadPlugins();

    const url = await conn.profilePictureUrl(num, 'image');
    const res = await fetch(url);
    const metre = Buffer.from(await res.arrayBuffer());
    const resize = await conn.resize(metre, 200, 200);

    const floc = {
        key: {
            participant: num,
            ...(m.chat ? {
                remoteJid: 'status@broadcast'
            } : {})
        },
        message: {
            locationMessage: {
                name: botname,
                jpegThumbnail: resize
            }
        }
    };

    function getPluginsByTags(selectedTags = []) {
        const tagHelpMapping = {};
        const selectedTagsLower = selectedTags.map(tag => tag.toLowerCase());

        Object.keys(plugins)
            .filter(pluginName => !plugins[pluginName].disabled)
            .forEach(pluginName => {
                const plugin = plugins[pluginName];
                const tagsArray = Array.isArray(plugin.tags) ? plugin.tags : [];
                const helpArray = Array.isArray(plugin.help) ? plugin.help : [plugin.help];

                tagsArray.forEach(tag => {
                    if (!tag) return;
                    if (selectedTags.length && !selectedTagsLower.includes(tag.toLowerCase())) return;

                    if (!tagHelpMapping[tag]) tagHelpMapping[tag] = [];
                    tagHelpMapping[tag].push(...helpArray);
                });
            });

        if (!Object.keys(tagHelpMapping).length) return "No menu found.";

        return Object.keys(tagHelpMapping).map(tag => {
            const helpList = tagHelpMapping[tag]
                .map(cmd => `┊꒱ 🐾   ${usedPrefix + cmd}`)
                .join('\n');

            return `─₍🌸🐾₎❝┊ *${tag.toUpperCase()}*
${helpList}
╰─── –`;
        }).join('\n\n');
    }

    // === Info User & Bot ===
    const jidsen = await (await conn?.signalRepository?.lidMapping?.getPNForLID(m.sender).catch(() => null))?.replace(/:\d+@/, '@')
    const user = {
        name: m.pushName || 'User',
        number: (jidsen || '').split('@')[0] || '62xxx-xxx-xxx',
        limit: db.data.users[m.sender]?.limit || 0,
        status: isROwner ? 'Pemilik' : 'Orang Bisaa'
    };

    const botNumber = Array.isArray(global.owner) ? global.owner[0] : typeof global.owner === 'string' ? global.owner : '62xxx-xxx-xxx';
    const cleanBotNumber = botNumber.replace('@s.whatsapp.net', '').split('@')[0];

    const botInfo = {
        name: global.botname || 'rin-okumura-bot',
        number: cleanBotNumber
    };

    const demonSlayerHeader = `こんにちは、お姉さん 柏和田 🌸.
私は、何かをしたり、検索したり、データ/情報を取得したりするのに役立つ自動システム (whatsapp ボット) ですが、whatsapp です。 🐱

 乂  *S T A T I S T I C*  🌸
 
 ┌ ◦ ʙᴏᴛᴛᴏ ɴᴏ ᴋɪɴᴏ̄ ᴏ ʜʏᴏ̄ᴊɪ: *.ᴍᴇɴᴜ ᴀʟʟ*
└ ◦ ᴍᴇɴʏᴜ̄ʀɪsᴜᴛᴏ ɴᴏ ʜʏᴏ̄ᴊɪ: *.ᴍᴇɴᴜ ʟɪsᴛ*`;

    const teksdx = `エラーを見つけた場合、またはプレミアム プランをアップグレードしたい場合は、所有者に連絡してください。 🌸`;

    const userInfoSection = `
. .╭── ︿︿︿︿︿ 🌸   .   .   .   .   . 
. .┊ ‹‹ *ɴᴀᴍᴇ* :: ${m.pushName || ""}
. .┊•*⁀➷ °... ℛᥱᥲd thι᥉ ... 🌸
. .╰─── ︶︶︶︶ ♡⃕  ⌇. . .
 . . ┊⿻ [ *ᴘʀᴇғɪx* :: <${usedPrefix || "."}>] . .
 . . ┊⿻ [ *ɴᴜᴍʙᴇʀ* :: ${user?.number}] . .
 . . ┊⿻ [ *ʟɪᴍɪᴛ* :: ${user?.limit}] . .
 . . ┊⿻ [ *sᴛᴀᴛᴜs* :: ${user?.status}] . .
 . . ╰─────────╮
`;

    // === Menu ===
    async function sendAudioFallback() {
        try {
            const {
                data: bufferAu
            } = await axios.get(global?.audioUrl, {
                responseType: "arraybuffer"
            });
            await sendWhatsAppVoice(conn, m.chat, bufferAu, {
                contextInfo: {
                    mentionedJid: [m.sender]
                },
                quoted: floc
            })
        } catch (err) {
            console.error("⚠️ Audio fetch failed:", err.message);
        }
    }

    if (text === "all") {
        await conn.delay(2000);
        const allCommands = getPluginsByTags();

        const caption = `${demonSlayerHeader}${readmore}

${getVpsSpecs()}
${userInfoSection}
${allCommands}

${teksdx}`;

        await conn.sendMessage(m.chat, {
            text: Styles(caption),
            contextInfo: {
                mentionedJid: [m.sender],
                ...menu
            }
        }, { quoted: floc });
        await sendAudioFallback();
    } else if (text === "list") {
        const allTags = [];
        Object.values(plugins).forEach(plugin => {
            if (!plugin.disabled && plugin.tags) {
                plugin.tags.forEach(tag => {
                    if (tag && !allTags.includes(tag.toLowerCase()))
                        allTags.push(tag.toLowerCase());
                });
            }
        });

        const tagsList = allTags
            .map(tag => `┊꒱ 🐾   ${tag}`)
            .join('\n');

        const caption = `${demonSlayerHeader}${readmore}

─₍🌸🐾₎❝┊ *MENU TAGS*
${tagsList}
╰─── –

${teksdx}`;

        await conn.sendMessage(m.chat, {
            text: Styles(caption),
            contextInfo: {
                mentionedJid: [m.sender],
                ...menu
            }
        }, { quoted: floc });
        await sendAudioFallback();
    } else if (text) {
        await conn.delay(2000);
        const tags = text.split(/[,\s]+/).filter(t => t);
        const filteredCommands = getPluginsByTags(tags);

        const caption = `${demonSlayerHeader}${readmore}

${getVpsSpecs()}
${userInfoSection}
${filteredCommands}

${teksdx}`;

        await conn.sendMessage(m.chat, {
            text: Styles(caption),
            contextInfo: {
                mentionedJid: [m.sender],
                ...menu
            }
        }, { quoted: floc });
        await sendAudioFallback();
    } else {
        const caption = `${demonSlayerHeader}${readmore}\n\n${getVpsSpecs()}\n${userInfoSection}\n${teksdx}`;

        await conn.sendMessage(m.chat, {
            text: Styles(caption),
            contextInfo: {
                mentionedJid: [m.sender],
                ...menu
            }
        }, { quoted: floc });
        await sendAudioFallback();
    }
};

handler.help = [];
handler.command = ["menu", "rinmenu"];
handler.tags = ["run"];

/**
 * Convert audio buffer ke WhatsApp voice note + waveform
 */
async function toWhatsAppVoice(inputBuffer) {
    const audioBuffer = await convert.toVN(inputBuffer)
    const waveform = await convert.generateWaveform(audioBuffer)
    return {
        audio: audioBuffer,
        waveform
    }
}

/**
 * Kirim WhatsApp PTT dan auto-play
 */
async function sendWhatsAppVoice(conn, chatId, inputBuffer, options = {}) {
    try {
        const {
            audio,
            waveform
        } = await toWhatsAppVoice(inputBuffer)

        // Kirim ke WhatsApp
        await conn.sendMessage(chatId, {
            audio: audio,
            waveform: waveform,
            mimetype: "audio/ogg; codecs=opus",
            ptt: true,
            ...options,
        }, {
            ...options
        })

    } catch (err) {
        console.error("Failed to send voice:", err)
    }
}

// === Styles Function ===
function Styles(text, style = 1) {
    const xStr = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
    const yStr = Object.freeze({
        1: "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890",
    });
    const replacer = xStr.map((v, i) => ({
        original: v,
        convert: yStr[style].split("")[i]
    }));
    return text.toLowerCase().split("").map(v => replacer.find(x => x.original == v)?.convert || v).join("");
}

function getVpsSpecs() {
    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
    const cpu = os.cpus()[0];
    const cpuModel = cpu.model;
    const cpuSpeed = cpu.speed;
    const cpuCores = os.cpus().length;

    return `. .╭── ︿︿︿︿︿ 🌸   .   .   .   .   . 
. .┊ ‹‹ *ɪɴғᴏ sᴇʀᴠᴇʀ*
. .┊•*⁀➷ °... ℛᥱᥲd thι᥉ ... 🌸
. .╰─── ︶︶︶︶ ♡⃕  ⌇. . .
 . . ┊⿻ [ *ᴍᴏᴅᴇʟ* :: ${cpuModel}] . .
 . . ┊⿻ [ *ᴛᴏᴛᴀʟ ʀᴀᴍ* :: ${totalMem} GB] . .
 . . ┊⿻ [ *ғʀᴇᴇ ʀᴀᴍ* :: ${freeMem} GB] . .
 . . ┊⿻ [ *sᴘᴇᴇᴅ* :: ${cpuSpeed} MHz]. . 
 . . ┊⿻ [ *ᴄᴏʀᴇs* :: ${cpuCores}]. . 
 . . ┊⿻ [ *ʟɪʙʀᴀʀʏ* :: @adiwajshing/baileys]. . 
 . . ┊⿻ [ *ᴄʀᴇᴀᴛᴏʀ* :: ${global?.ownername}]. . 
 . . ╰─────────╮`.trim();
}

export default handler;