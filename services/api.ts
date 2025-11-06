/**
 * API configuration and environment host resolver
 * Handles base URLs and service grouping
 */

const HOST = process.env.EXPO_PUBLIC_BACKEND_HOST || "192.168.8.102";
const SENSOR_PORT = process.env.EXPO_PUBLIC_SENSOR_PORT || "5000";
const IMAGE_PORT = process.env.EXPO_PUBLIC_IMAGE_PORT || "5001";
const NOTIFY_PORT = process.env.EXPO_PUBLIC_NOTIFY_PORT || "5002";

const BASE_SENSOR = `http://${HOST}:${SENSOR_PORT}`;
const BASE_IMAGE = `http://${HOST}:${IMAGE_PORT}`;
const BASE_NOTIFY = `http://${HOST}:${NOTIFY_PORT}`;

// Used for blogs, recipes, and AI endpoints
const MAIN_BASE_URL = BASE_NOTIFY;

export const API = {
  // --- Sensor ---
  HEALTH_SENSOR: `${BASE_SENSOR}/health`,
  LIVE_NH3: `${BASE_SENSOR}/live-nh3`,
  PREDICT_SENSOR: `${BASE_SENSOR}/predict-sensor`,
  DASHBOARD_STATS: `${BASE_SENSOR}/dashboard/stats`,
  LAST_SENSOR: `${BASE_SENSOR}/dashboard/last-sensor`,
  HISTORY_SENSOR: `${BASE_SENSOR}/history`,

  // --- Image ---
  HEALTH_IMAGE: `${BASE_IMAGE}/health`,
  PREDICT_IMAGE: `${BASE_IMAGE}/predict-image`,
  LAST_IMAGE: `${BASE_IMAGE}/dashboard/last-image`,
  HISTORY_IMAGE: `${BASE_IMAGE}/history`,

  // --- Notification + Blog ---
  HEALTH_NOTIFY: `${BASE_NOTIFY}/health`,
  NOTIFICATIONS: `${BASE_NOTIFY}/notifications`,
  BLOGS: `${BASE_NOTIFY}/blogs`, // ✅ Added
  BLOGS_LIST: `${BASE_NOTIFY}/blogs/list`, // ✅ Added

  // --- Recipes (AI) ---
  PREDICT_RECIPES: `${MAIN_BASE_URL}/predict-recipes`, // ✅ Added
  MAIN_BASE_URL, // ✅ Added (used in Blog & Recipe Screens)
};
