/**
 * API configuration and environment host resolver
 * Handles base URLs and service grouping
 *
 * Expo automatically exposes variables prefixed with EXPO_PUBLIC_*
 * (defined inside .env.local)
 *
 * Example:
 * EXPO_PUBLIC_BACKEND_HOST=192.168.8.102
 * EXPO_PUBLIC_SENSOR_PORT=5000
 * EXPO_PUBLIC_IMAGE_PORT=5001
 * EXPO_PUBLIC_NOTIFY_PORT=5002
 */

const HOST = process.env.EXPO_PUBLIC_BACKEND_HOST || "192.168.8.102";
const SENSOR_PORT = process.env.EXPO_PUBLIC_SENSOR_PORT || "5000";
const IMAGE_PORT = process.env.EXPO_PUBLIC_IMAGE_PORT || "5001";
const NOTIFY_PORT = process.env.EXPO_PUBLIC_NOTIFY_PORT || "5002";

// 🧩 Service Bases
const BASE_SENSOR = `http://${HOST}:${SENSOR_PORT}`;
const BASE_IMAGE = `http://${HOST}:${IMAGE_PORT}`;
const BASE_NOTIFY = `http://${HOST}:${NOTIFY_PORT}`;

// 🌐 Global API Endpoints
export const API = {
  // Sensor service
  HEALTH_SENSOR: `${BASE_SENSOR}/health`,
  LIVE_NH3: `${BASE_SENSOR}/live-nh3`,
  PREDICT_SENSOR: `${BASE_SENSOR}/predict-sensor`,
  DASHBOARD_STATS: `${BASE_SENSOR}/dashboard/stats`,
  LAST_SENSOR: `${BASE_SENSOR}/dashboard/last-sensor`,
  HISTORY_SENSOR: `${BASE_SENSOR}/history`,

  // Image service
  HEALTH_IMAGE: `${BASE_IMAGE}/health`,
  PREDICT_IMAGE: `${BASE_IMAGE}/predict-image`,
  LAST_IMAGE: `${BASE_IMAGE}/dashboard/last-image`,
  HISTORY_IMAGE: `${BASE_IMAGE}/history`,

  // Notification & Blog service
  HEALTH_NOTIFY: `${BASE_NOTIFY}/health`,
  NOTIFICATIONS: `${BASE_NOTIFY}/notifications`,
  BLOGS_LIST: `${BASE_NOTIFY}/blogs/list`,
  BLOGS_ADD: `${BASE_NOTIFY}/blogs/add`,
};

export default API;
