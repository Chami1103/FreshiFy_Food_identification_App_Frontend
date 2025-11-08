// E:\FreshiFy_Mobile_App_Frontend\config\config.ts
import Constants from "expo-constants";

/**
 * ==============================================================
 * 🌍 FreshiFy App — Dynamic API Configuration
 * Automatically switches between Local (Development) and AWS (Production)
 * ==============================================================
 */

// 🔹 Extract environment variables from Expo config (.env or eas.json)
const {
  EXPO_PUBLIC_BACKEND_HOST,
  EXPO_PUBLIC_SENSOR_PORT,
  EXPO_PUBLIC_IMAGE_PORT,
  EXPO_PUBLIC_NOTIFY_PORT,
} = Constants.expoConfig?.extra || {};

// 🔹 Determine environment
const isProduction = process.env.NODE_ENV === "production";

// 🔹 Hostname selection (change AWS host below for your EC2)
const BASE_HOST = isProduction
  ? "ec2-54-201-120-210.ap-southeast-1.compute.amazonaws.com" // 🔧 Replace with your real EC2 DNS
  : EXPO_PUBLIC_BACKEND_HOST || "192.168.8.102";

// 🔹 Construct base URLs
const BASE_SENSOR = `http://${BASE_HOST}:${EXPO_PUBLIC_SENSOR_PORT || 5000}`;
const BASE_IMAGE = `http://${BASE_HOST}:${EXPO_PUBLIC_IMAGE_PORT || 5001}`;
const BASE_MAIN = `http://${BASE_HOST}:${EXPO_PUBLIC_NOTIFY_PORT || 5002}`;

/**
 * ==============================================================
 * ⚙️ Core API Configuration
 * ==============================================================
 */
export const API_CONFIG = {
  SENSOR_BASE_URL: BASE_SENSOR,
  IMAGE_BASE_URL: BASE_IMAGE,
  MAIN_BASE_URL: BASE_MAIN,
};

/**
 * ==============================================================
 * 🔗 Unified API Endpoints
 * ==============================================================
 */
export const API = {
  // 🧠 Flask AI Model APIs
  PREDICT_SENSOR: `${BASE_SENSOR}/predict-sensor`,
  LIVE_NH3: `${BASE_SENSOR}/live-nh3`,
  PREDICT_IMAGE: `${BASE_IMAGE}/predict-image`,

  // 📊 Dashboard Data
  DASHBOARD_STATS: `${BASE_SENSOR}/dashboard/stats`,
  LAST_SENSOR: `${BASE_SENSOR}/dashboard/last-sensor`,
  LAST_IMAGE: `${BASE_IMAGE}/dashboard/last-image`,
  HISTORY: `${BASE_SENSOR}/history`,

  // 📰 Content & Notifications
  BLOGS: `${BASE_MAIN}/blogs`,
  NOTIFICATIONS: `${BASE_MAIN}/notifications`,

  // 🍳 AI-Powered Recipes (Gemini)
  PREDICT_RECIPES: `${BASE_MAIN}/predict-recipes`,
};

export default API;
