import React from "react";

/* ===========================================================
   📱 Navigation Types
   =========================================================== */
export type Screen =
  | "home"
  | "detection"
  | "recipes"
  | "notifications"
  | "blog"
  | "profile";

export interface NavItem {
  name: Screen;
  label: string;
  icon: React.FC<{ className?: string }>;
}

/* ===========================================================
   👤 User Profile
   =========================================================== */
export interface UserProfile {
  readonly name: string;
  readonly age: string;
  readonly preferences: string;
  readonly allergies: string;
  readonly healthStatus: string;
  readonly familyMember: string;
}

/* ===========================================================
   📊 Dashboard & Stats
   =========================================================== */
export interface StatsData {
  readonly totalScans: number;
  readonly fresh: number;
  readonly spoiled: number;
  readonly freshnessPercentage: number;
}

/* ===========================================================
   🌫️ Sensor History / NH₃ Data
   =========================================================== */
export interface HistoryData {
  readonly date: string;
  readonly nh3_avg: number;
  readonly fresh?: number;
  readonly spoiled?: number;
  readonly sensorScans?: number;
  readonly cameraScans?: number;
}

/* ===========================================================
   📰 Blog & Notifications
   =========================================================== */
export interface BlogPost {
  readonly id: string;
  readonly title: string;
  readonly preview: string;
  readonly imageUrl: string;
  readonly author: string;
  readonly date: string;
}

export type NotificationIcon = "alert" | "info" | "food";

export type NotificationType =
  | "success"
  | "error"
  | "info"
  | "alert"
  | "spoiled_alert"
  | "cost_update"
  | "high_gas"
  | "reminder";

/**
 * Unified app notification model
 * (Used in both Header.tsx and NotificationScreen)
 */
export interface Notification {
  readonly id: string;
  readonly icon: NotificationIcon;
  readonly title: string;
  readonly timestamp: string;
  readonly type?: NotificationType;
  readonly read?: boolean;
}

export interface AppNotification {
  readonly id: string;
  readonly type: NotificationType;
  readonly title: string;
  readonly message: string;
}

/* ===========================================================
   🍳 Gemini / Recipe AI
   =========================================================== */
export interface Recipe {
  readonly title: string;
  readonly ingredients: string[];
  readonly instructions: string[];
  readonly prepTime: string;
}

/* ===========================================================
   🧪 Sensor & Image Data Models
   =========================================================== */
export type SpoilageStatus = "Fresh" | "Spoiled";

export interface LastSensorData {
  readonly foodName: string;
  readonly status: SpoilageStatus;
  readonly nh3: number;
  readonly humidity: number;
  readonly temperature: number;
  readonly timestamp: string;
}

export interface LastImageData {
  readonly foodName: string;
  readonly status: SpoilageStatus;
  readonly imageUrl: string;
  readonly timestamp: string;
}

/* ===========================================================
   💰 Cost Tracker
   =========================================================== */
export interface CostItem {
  readonly id: string;
  readonly name: string;
  readonly amount: number;
}

/* ===========================================================
   🖼️ Image Analysis / Multi-upload
   =========================================================== */
export interface AnalyzedImage {
  readonly id: string;
  readonly file: File;
  readonly preview: string;
}

export interface ImagePredictionResult {
  readonly id: string;
  readonly foodName: string;
  readonly status: SpoilageStatus;
}

export interface PredictionCardData extends ImagePredictionResult {
  readonly imagePreview: string;
  readonly timestamp: string;
}

/* ===========================================================
   🔍 History & Prediction Tracking
   =========================================================== */
export type ScanType = "sensor" | "camera";

export interface PredictionHistoryItem {
  readonly id: string;
  readonly type: ScanType;
  readonly foodName: string;
  readonly status: SpoilageStatus;
  readonly timestamp: string;
  readonly imageUrl?: string; // for camera scans
  readonly nh3?: number; // for sensor scans
}
