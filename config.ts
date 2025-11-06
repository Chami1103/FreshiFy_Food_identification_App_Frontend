// config/config.ts
const BASE_SENSOR = "http://192.168.8.102:5000";
const BASE_IMAGE = "http://192.168.8.102:5001";
const BASE_MAIN = "http://192.168.8.102:5002";

export const API_CONFIG = {
  SENSOR_BASE_URL: BASE_SENSOR,
  IMAGE_BASE_URL: BASE_IMAGE,
  MAIN_BASE_URL: BASE_MAIN,
};

export const API = {
  PREDICT_SENSOR: `${BASE_SENSOR}/predict-sensor`,
  LIVE_NH3: `${BASE_SENSOR}/live-nh3`,
  PREDICT_IMAGE: `${BASE_IMAGE}/predict-image`,
  DASHBOARD_STATS: `${BASE_SENSOR}/dashboard/stats`,
  LAST_SENSOR: `${BASE_SENSOR}/dashboard/last-sensor`,
  LAST_IMAGE: `${BASE_IMAGE}/dashboard/last-image`,
  HISTORY: `${BASE_SENSOR}/history`,
  BLOGS: `${BASE_MAIN}/blogs`,
  NOTIFICATIONS: `${BASE_MAIN}/notifications`,
};

export default API;
