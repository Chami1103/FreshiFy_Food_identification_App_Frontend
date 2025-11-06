// types/api.d.ts
declare module "@/config/config" {
  export interface APIEndpoints {
    PREDICT_SENSOR: string;
    LIVE_NH3: string;
    PREDICT_IMAGE: string;
    DASHBOARD_STATS: string;
    LAST_SENSOR: string;
    LAST_IMAGE: string;
    HISTORY: string;
    BLOGS: string;
    NOTIFICATIONS: string;
  }

  export const API: APIEndpoints;
  export default API;
}
