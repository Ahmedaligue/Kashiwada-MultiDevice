import moment from 'moment';
import cron from 'node-cron';
import api from '#izumi/api';

let handler = m => m;

/**
 * @param {Object} options
 * @param {"Senin"|"Selasa"|"Rabu"|"Kamis"|"Jumat"|"Sabtu"|"Minggu"|"all"} options.day
 */
async function getOtakudesuOngoing({ day = "all" } = {}) {
  const { data } = await api.get("/anime/otakudesu/ongoing");

  if (!data?.status) return [];

  if (day === "all") {
    return data.result;
  }

  return data.result.filter(item =>
    item.type?.toLowerCase() === day.toLowerCase()
  );
}

handler.before = async (m, { conn }) => {
  try {
    const ox = "120363267102694949@g.us";
    let isExecuting = false;

    async function cekcek() {
      if (isExecuting) {
        console.log('Fungsi sedang berjalan, skip eksekusi.');
        return; 
      }

      isExecuting = true;

      try {
        const now = moment().tz('Asia/Jakarta').locale("id").startOf('minute');
        const time = "10:00";

        const sett = moment.tz(`${now.format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD HH:mm', 'Asia/Jakarta');
        if (now.isSame(sett, 'minute')) {
          const p = await getOtakudesuOngoing({ day: now.format("dddd").toUpperCase() });
          
          let caption = ` -- (☘️Ongoing Otakudesu☘️) --
 *-(Judul)-:* ${p?.[0]?.title || ""}
 *-(Episode)-:* ${p?.[0]?.episode || ""}
 *-(Link)-:* ${p?.[0]?.link || ""}

 ------------- ( ☘️Rilis☘️ )  -------------
 *-(Hari)-:* ${p?.[0]?.type || ""}
 *-(Tanggal)-:* ${p?.[0]?.date || ""}`
          const image = await (await api.get(`/anime/otakudesu/getfotolink?imageUrl=${p?.[0]?.image}`, { responseType: "arraybuffer" })).data;
          await conn.sendMessage(ox, {
               image,
               caption,
          })
        }
      } catch (error) {
        console.error('Error saat menjalankan cekcek:', error);
      } finally {
        isExecuting = false; // <-- Set flag jadi false di akhir, baik berhasil atau error
      }
    }

    cron.schedule('*/1 * * * *', () => {
      cekcek();
    }, {
      timezone: "Asia/Jakarta"
    });
  } catch(e) {
  
  }
}