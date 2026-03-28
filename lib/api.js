import axios from "axios";
import FormData from "form-data";
function webapi(apiweb = "izumi") {
  return global.apikey[apiweb];
}
const api = {
  async get(endpoint, config = {}) {
    const apilist = Object.keys(global.apikey);
    const nameapi = config?.nameapi || "izumi";
    if (!apilist.includes(nameapi)) {
      return {
        ban: true,
        message: `[ ! ] ApiKey Tersedia: ${apilist.join(", ")}`
      };
    }
    const baseURL = webapi(nameapi);
    const res = await axios.get(baseURL + endpoint, {
      ...config
    });
    res.data.baseURL = baseURL
    if (config.type === "result") {
      return res.data;
    }
    return res;
  },
  async post(endpoint, data = {}, config = {}) {
    const apilist = Object.keys(global.apikey);
    const nameapi = config?.nameapi || "izumi";
    if (!apilist.includes(nameapi)) {
      return {
        ban: true,
        message: `[ ! ] ApiKey Tersedia: ${apilist.join(", ")}`
      };
    }
    const baseURL = webapi(nameapi);
    const res = await axios.post(baseURL + endpoint, data, {
      ...config
    });
    res.data.baseURL = baseURL
    if (config.type === "result") {
      return res.data;
    }
    return res;
  },
  async uploadEnd(endpoint, data = {}, config = {}) {
    const apilist = Object.keys(global.apikey);
    const nameapi = config?.nameapi || "izumi";
    if (!apilist.includes(nameapi)) {
      return {
        ban: true,
        message: `[ ! ] ApiKey Tersedia: ${apilist.join(", ")}`
      };
    }
    const baseURL = webapi(nameapi);
    const form = new FormData();
    const buffer = data.buffer;
    const mimetype = data.mimetype || "application/octet-stream";
    const ext = mimetype.split("/")[1] || "bin";
    const field = data.type || "file";
    form.append(field, buffer, {
      filename: Date.now() + "." + ext,
      contentType: mimetype
    });
    if (data.fields) {
      for (const key in data.fields) {
        form.append(key, data.fields[key]);
      }
    }
    const res = await axios.post(baseURL + endpoint, form, {
      headers: {
        ...form.getHeaders(),
        ...(config.headers || {})
      },
      ...config
    });
    res.data.baseURL = baseURL
    if (config.type === "result") {
      return res.data;
    }
    return res;
  }
};
export default api;
