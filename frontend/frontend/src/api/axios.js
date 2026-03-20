import axios from "axios";

// Detect if running inside Android WebView
const isAndroid = navigator.userAgent.includes("Android");

// Choose API URL
const BASE_URL = isAndroid
  ? "http://10.0.2.2:8000"
  : "http://127.0.0.1:8000";

const API = axios.create({
  baseURL: BASE_URL,
});

// Attach JWT token automatically
API.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;