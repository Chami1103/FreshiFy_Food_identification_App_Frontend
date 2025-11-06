import "dotenv/config";

export default {
  expo: {
    name: "FreshiFy",
    slug: "freshify",
    scheme: "freshify",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#f8fafc",
    },
    android: {
      package: "com.freshify.app",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: ["CAMERA", "READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE"],
    },
    ios: { supportsTablet: true },

    // ✅ Inject environment variables
    extra: {
      EXPO_PUBLIC_BACKEND_HOST: process.env.EXPO_PUBLIC_BACKEND_HOST,
      EXPO_PUBLIC_SENSOR_PORT: process.env.EXPO_PUBLIC_SENSOR_PORT,
      EXPO_PUBLIC_IMAGE_PORT: process.env.EXPO_PUBLIC_IMAGE_PORT,
      EXPO_PUBLIC_NOTIFY_PORT: process.env.EXPO_PUBLIC_NOTIFY_PORT,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    },
  },
};
