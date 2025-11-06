import { API } from "./api";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import {
  StatsData,
  HistoryData,
  LastSensorData,
  LastImageData,
  PredictionHistoryItem,
  BlogPost,
  Notification,
} from "../types";

/* ===========================================================
   🔁 Retry, Toast & Caching Helpers
   =========================================================== */

async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    const delay = (4 - retries) * 1000;
    await new Promise((r) => setTimeout(r, delay));
    return withRetry(fn, retries - 1);
  }
}

const showToast = (type: "success" | "error" | "info", msg: string) => {
  Toast.show({
    type,
    text1: type.toUpperCase(),
    text2: msg,
    visibilityTime: 2500,
  });
};

const cacheData = async (key: string, data: any) => {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(data));
  } catch (e) {
    console.warn("[CACHE] Save failed:", e);
  }
};

const getCached = async <T>(key: string): Promise<T | null> => {
  try {
    const val = await SecureStore.getItemAsync(key);
    return val ? (JSON.parse(val) as T) : null;
  } catch {
    return null;
  }
};

/* ===========================================================
   🌐 Fetch Helpers
   =========================================================== */

const fetchJson = async <T>(url: string, cacheKey?: string): Promise<T | null> => {
  try {
    const result = await withRetry(async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as T;
    });

    if (cacheKey) cacheData(cacheKey, result);
    return result;
  } catch {
    showToast("error", `Network error while fetching ${url}`);
    if (cacheKey) {
      const cached = await getCached<T>(cacheKey);
      if (cached) {
        showToast("info", `Loaded offline data (${cacheKey})`);
        return cached;
      }
    }
    return null;
  }
};

/* ===========================================================
   📊 Dashboard APIs
   =========================================================== */

export const getStats = async (): Promise<StatsData | null> => {
  const data = await fetchJson<{ totalScans: number; freshCount: number; spoiledCount: number }>(
    API.DASHBOARD_STATS,
    "stats_cache"
  );
  if (!data) return null;

  const total = data.totalScans || 0;
  const fresh = data.freshCount || 0;
  const spoiled = data.spoiledCount || 0;
  return {
    totalScans: total,
    fresh,
    spoiled,
    freshnessPercentage: total ? Math.round((fresh / total) * 100) : 0,
  };
};

export const getHistory = async (): Promise<HistoryData[]> => {
  const data = await fetchJson<any[]>(API.HISTORY_SENSOR, "history_cache");
  if (!data) return [];
  return data.map((d) => ({
    date: new Date(d.createdAt).toLocaleDateString(),
    nh3_avg: d.nh3 ?? 0,
    fresh: d.status === "Fresh" ? 1 : 0,
    spoiled: d.status === "Spoiled" ? 1 : 0,
    sensorScans: 1,
  }));
};

export const getLastSensorScan = async (): Promise<LastSensorData | null> => {
  const d = await fetchJson<any>(API.LAST_SENSOR, "last_sensor_cache");
  if (!d) return null;
  return {
    foodName: d.food ?? "General Food",
    status: d.status ?? "Fresh",
    nh3: d.nh3 ?? 0,
    humidity: Math.floor(Math.random() * 10) + 60,
    temperature: Math.floor(Math.random() * 5) + 25,
    timestamp: d.createdAt ?? new Date().toISOString(),
  };
};

export const getLastImageScan = async (): Promise<LastImageData | null> => {
  const d = await fetchJson<any>(API.LAST_IMAGE, "last_image_cache");
  if (!d) return null;
  const base = API.HEALTH_IMAGE.replace("/health", "/uploads/");
  return {
    foodName: d.food ?? "Unknown",
    status: d.status ?? "Fresh",
    imageUrl: `${base}${d.file ?? ""}`,
    timestamp: d.createdAt ?? new Date().toISOString(),
  };
};

export const getPredictionHistory = async (): Promise<PredictionHistoryItem[]> => {
  const [sensor, image] = await Promise.all([
    fetchJson<any[]>(API.HISTORY_SENSOR, "sensor_history_cache"),
    fetchJson<any[]>(API.HISTORY_IMAGE, "image_history_cache"),
  ]);
  const s = (sensor ?? []).map((i) => ({
    id: i.id,
    type: "sensor" as const,
    foodName: i.food ?? "General Food",
    status: i.status ?? "Fresh",
    timestamp: i.createdAt ?? new Date().toISOString(),
    nh3: i.nh3,
  }));
  const c = (image ?? []).map((i) => ({
    id: i.id,
    type: "camera" as const,
    foodName: i.food ?? "Unknown",
    status: i.status ?? "Fresh",
    timestamp: i.createdAt ?? new Date().toISOString(),
    imageUrl: `${API.HEALTH_IMAGE.replace("/health", "/uploads/")}${i.file ?? ""}`,
  }));
  return [...s, ...c].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

/* ===========================================================
   📰 Blogs & Notifications
   =========================================================== */

export const getBlogs = async (): Promise<BlogPost[]> => {
  const data = await fetchJson<any[]>(API.BLOGS_LIST, "blogs_cache");
  if (!data) return [];
  return data.map((b) => ({
    id: b._id ?? b.id,
    title: b.title ?? "Untitled",
    preview: b.content?.slice(0, 100) ?? "",
    imageUrl: b.image ?? "",
    author: b.author ?? "Unknown",
    date: new Date(b.createdAt).toLocaleDateString(),
  }));
};

export const getNotifications = async (): Promise<Notification[]> => {
  const data = await fetchJson<any[]>(API.NOTIFICATIONS, "notifications_cache");
  if (!data) return [];
  return data.map((n) => ({
    id: n._id ?? n.id,
    icon: "info",
    title: n.message ?? "Notification",
    timestamp: new Date(n.createdAt).toISOString(),
  }));
};

/* ===========================================================
   🧠 Image Analysis (used in CameraScanView)
   =========================================================== */

export const analyzeImages = async (
  files: any[]
): Promise<{ foodName: string; status: string }[]> => {
  try {
    const formData = new FormData();
    files.forEach((file: any, index: number) => {
      formData.append("files", {
        uri: file.uri,
        name: file.fileName || `image_${index}.jpg`,
        type: file.type || "image/jpeg",
      } as any);
    });

    const res = await fetch(API.PREDICT_IMAGE, {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: formData,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Normalize result
    if (Array.isArray(data)) return data;
    if (data?.results) return data.results;
    return [data];
  } catch (err) {
    console.error("[analyzeImages] Error:", err);
    showToast("error", "Image analysis failed. Try again later.");
    return [];
  }
};
