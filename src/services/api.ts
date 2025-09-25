import axios from "axios";

const api = axios.create({
  baseURL: "https://beta.guardia-api.box3.work/api",
});

export default api;
