import axios from "axios";
import { API_BASE_URL, buildAssetUrl } from "./utils/assetUrl";

const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
export { API_BASE_URL, buildAssetUrl };
