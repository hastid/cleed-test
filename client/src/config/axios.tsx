import axios from "axios";

axios.defaults.baseURL = "http://localhost:4848/api";

export const instance = axios;
