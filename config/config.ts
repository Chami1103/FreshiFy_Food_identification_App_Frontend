// config/config.ts
/**
 * FreshiFy App - API Configuration (Dynamic)
 * ------------------------------------------
 * Reads backend URLs from Expo environment variables.
 * Works on local LAN for Android (Redmi Note 9S) and production builds.
 */

const HOST = process.env.EXPO_PUBLIC_BACKEND_HOST || "192.168.8.102"; // fallback
const SENSOR_PORT = process.env.EXPO_PUBLIC_SENSOR_PORT || "5000";
const IMAGE_PORT = process.env.EXPO_PUBLIC_IMAGE_PORT || "5001";
const NOTIFY_PORT = process.env.EXPO_PUBLIC_NOTIFY_PORT || "5002";

// Base URLs
export const API_CONFIG = {
  SENSOR_BASE_URL: `http://${HOST}:${SENSOR_PORT}`,
  IMAGE_BASE_URL: `http://${HOST}:${IMAGE_PORT}`,
  MAIN_BASE_URL: `http://${HOST}:${NOTIFY_PORT}`,
} as const;

const { SENSOR_BASE_URL, IMAGE_BASE_URL, MAIN_BASE_URL } = API_CONFIG;

// API Routes
export const API = {
  // Sensor Service
  HEALTH_SENSOR: `${SENSOR_BASE_URL}/health`,
  LIVE_NH3: `${SENSOR_BASE_URL}/live-nh3`,
  PREDICT_SENSOR: `${SENSOR_BASE_URL}/predict-sensor`,
  DASHBOARD_STATS: `${SENSOR_BASE_URL}/dashboard/stats`,
  LAST_SENSOR: `${SENSOR_BASE_URL}/dashboard/last-sensor`,
  HISTORY_SENSOR: `${SENSOR_BASE_URL}/history`,

  // Image Service
  HEALTH_IMAGE: `${IMAGE_BASE_URL}/health`,
  PREDICT_IMAGE: `${IMAGE_BASE_URL}/predict-image`,
  LAST_IMAGE: `${IMAGE_BASE_URL}/dashboard/last-image`,
  HISTORY_IMAGE: `${IMAGE_BASE_URL}/history`,

  // Notify / Blogs / Calendar / Calculator
  HEALTH_NOTIFY: `${MAIN_BASE_URL}/health`,
  NOTIFICATIONS: `${MAIN_BASE_URL}/notifications`,
  NOTIFY: `${MAIN_BASE_URL}/notify`,
  CALENDAR_ADD: `${MAIN_BASE_URL}/calendar/add`,
  BLOGS_ADD: `${MAIN_BASE_URL}/blogs/add`,
  BLOGS_LIST: `${MAIN_BASE_URL}/blogs/list`,
  BLOGS_DELETE: (id: string) => `${MAIN_BASE_URL}/blogs/delete/${id}`,
  CALCULATOR_ADD: `${MAIN_BASE_URL}/calculator/add`,
  CALCULATOR_SUMMARY: `${MAIN_BASE_URL}/calculator/summary`,
} as const;

export default API;
