/**
 * @SCRIPT      🔥 KASHIWADA-BOTWA 🔥
 * @INFO        Script ini GRATIS, bukan untuk dijual belikan.
 * @WARNING     Jangan ngaku-ngaku, jangan jual script gratis, dosa bro 😭
 * 
 * @BASE        NAO-MD
 * @BASE_OWNER  SHIROKAMI RYZEN
 * 
 * @AUTHOR      IZUKU-MII
 * @REMAKE      IZUKU-MII
 * 
 * @NOTE        SEMOGA YANG COLONG SCRIPT INI DAPET HIKMAH DAN TOBAT 🙏
 * 
 * @COPYRIGHT   © 2025 IZUKU-MII | All Rights Free.
 */

import fs from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import moment from 'moment-timezone';
import axios from 'axios';

// Fix untuk ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/*============= WAKTU =============*/
let wibh = moment.tz('Asia/Jakarta').format('HH');
let wibm = moment.tz('Asia/Jakarta').format('mm');
let wibs = moment.tz('Asia/Jakarta').format('ss');
let wktuwib = `${wibh} H ${wibm} M ${wibs} S`;
let wktugeneral = `${wibh}:${wibm}:${wibs}`;

let d = new Date(new Date().getTime() + 3600000);
let locale = 'id';
let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5];
let week = d.toLocaleDateString(locale, { weekday: 'long' });
let date = d.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
});

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

let set = JSON.parse(fs.readFileSync("./config.json"))
Object.assign(global, set)

let Func;
try {
    const funcModule = await import('./function.js');
    Func = funcModule.default;
    global.Func = Func;
} catch (error) {
    console.error(chalk.red('Error loading function.js:'), error);
    global.Func = {};
}

let thumbnail;
try {
    const response = await axios.get(global.thumbnailUrl, { 
        responseType: "arraybuffer",
        timeout: 10000 
    });
    thumbnail = response.data;
} catch (error) {
    console.warn(chalk.yellow('Failed to load thumbnail, using default'));
    thumbnail = Buffer.from('');
}
global.thumbnail = thumbnail;

global.menu = {
    forwardingScore: 1,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: global.id.saluran,
        serverMessageId: 103,
        newsletterName: global.botname
    },
    externalAdReply: {
        title: global.botname,
        body: global.ownername,
        mediaType: 1,
        thumbnail: global.thumbnail,
        sourceUrl: global.web,
        renderLargerThumbnail: true
    }
};

global.replyCostum = async (text) => {
    return {
        text: text
    };
};

// Watch file untuk auto-reload
let file = fileURLToPath(import.meta.url);

fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.redBright("Update 'config.js'"));
    import(`${file}?update=${Date.now()}`);
});