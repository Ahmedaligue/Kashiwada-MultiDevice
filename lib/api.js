import axios from "axios";
import FormData from "form-data";

const baseURL = global?.apikey?.izumi?.replace(/\/$/, "");

const api = {
  get(endpoint, config = {}) {
    return axios.get(baseURL + endpoint, {
      ...config
    });
  },

  post(endpoint, data = {}, config = {}) {
    return axios.post(
      baseURL + endpoint,
      data,
      {
        ...config
      }
    );
  },

  uploadEnd(endpoint, data = {}, config = {}) {

    const form = new FormData()

    const buffer = data.buffer
    const mimetype = data.mimetype || "application/octet-stream"
    const ext = mimetype.split("/")[1] || "bin"

    const field = data.type || "file"

    form.append(field, buffer, {
      filename: Date.now() + "." + ext,
      contentType: mimetype
    })

    if (data.fields) {
      for (const key in data.fields) {
        form.append(key, data.fields[key])
      }
    }

    return axios.post(
      baseURL + endpoint,
      form,
      {
        headers: {
          ...form.getHeaders(),
          ...(config.headers || {})
        },
        ...config
      }
    );
  }
};

export default api;