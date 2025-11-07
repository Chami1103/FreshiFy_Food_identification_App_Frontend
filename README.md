# 🥗 FreshiFy Frontend

The **FreshiFy Frontend** is a modern **React Native + Expo** mobile application for intelligent food freshness monitoring.  
It connects with the Flask-based backend to provide real-time **image detection**, **gas sensor analysis**, and **dashboard analytics** in a unified mobile experience.

---

## 🌟 Features

### 🍃 Dashboard
- Displays overall statistics (Total Scans, Fresh, Spoiled items).
- Summarizes **latest sensor** and **image detections**.
- Shows NH₃ (ppm) averages and freshness rate.
- Animated global header that hides/reappears on scroll.

### 🔬 Detection Module
- **Image Detection** → classifies food as *Fresh* or *Spoiled* using MobileNet V2.
- **Gas Sensor** → receives MQ-135 sensor readings in real time.
- Unified **Detection Dashboard** with tabbed interface for both modes.

### 🧠 Analytics + History
- Displays NH₃ trends, freshness statistics, and recent predictions.
- Interactive cards with pull-to-refresh functionality.

### 🌙 Theming & UI
- Light/Dark mode toggle (`ThemeToggle` component).
- Clean rounded-card design and consistent color palette (`#2563eb`, `#10b981`, `#f8fafc`).

### 🔔 Notifications + Blog
- Notification center and food-saving tips section built into the tab navigation.

---

## 🏗 Project Structure

```
FreshiFy_Mobile_App_Frontend/
│
├── app/                         # Expo Router structure
│   ├── _layout.tsx              # Global layout with Tabs + Header
│   ├── index.tsx                # Home route
│   └── detection/               # Detection screens (module)
│       ├── dashboard.tsx
│       ├── sensor.tsx
│       ├── analytics.tsx
│       └── cost.tsx
│
├── components/                  # Shared UI components
│   ├── Header.tsx
│   ├── Card.tsx
│   ├── Loader.tsx
│   ├── StatusBadge.tsx
│   └── ShimmerCard.tsx
│
├── contexts/                    # App state providers
│   ├── ThemeContext.tsx
│   └── NotificationContext.tsx
│
├── screens/                     # Logical screens (with scrollable headers)
│   ├── HomeScreen.tsx
│   ├── AnalyticsScreen.tsx
│   ├── CostScreen.tsx
│   └── detection/
│       ├── DetectView.tsx
│       ├── SensorDetectView.tsx
│       ├── CameraScanView.tsx
│       ├── DetectionDashboard.tsx
│       └── SelectionView.tsx
│
├── services/                    # API handlers and config
│   ├── api.ts
│   └── apiService.ts
│
├── types.ts                     # Shared TypeScript interfaces
├── config.ts                    # Environment variables (Frontend API URLs)
├── app.json / app.config.js     # Expo configuration
├── package.json
└── tsconfig.json
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/FreshiFy_Mobile_App_Frontend.git
cd FreshiFy_Mobile_App_Frontend
```

### 2️⃣ Install dependencies
```bash
npm install
# or
yarn install
```

### 3️⃣ Set environment variables
Create a `.env.local` file (with your API URLs):
```bash
MAIN_BASE_URL=https://your-api-url.com
SENSOR_BASE_URL=https://your-sensor-api-url.com
IMAGE_BASE_URL=https://your-image-api-url.com
```

### 4️⃣ Run the app locally
```bash
npx expo start
```
Then scan the QR code using the **Expo Go** app on your device.

---

## 🧱 Built With

| Stack | Purpose |
|-------|----------|
| ⚛️ React Native + Expo | Cross-platform mobile UI |
| 🧭 Expo Router | File-based navigation & tab system |
| 💅 React Native Animated API | Smooth header animations |
| 🌙 Context API | Theme and notification state management |
| ⚙️ Axios | REST API calls to Flask backend |
| 🧠 TypeScript | Type safety & intellisense |
| 🔤 Expo Icons | Unified iconography (Ionicons set) |

---

## 🧩 Notable UI Components

| Component | Function |
|------------|-----------|
| **Header.tsx** | Animated global header with theme toggle & dynamic page titles |
| **Card.tsx** | Reusable card container with shadow and rounded corners |
| **Loader.tsx** | Circular loading indicator with text support |
| **StatusBadge.tsx** | Shows food status (Fresh/Spoiled) with color badges |
| **ShimmerCard.tsx** | Skeleton loading placeholder for async data |

---

## 📄 License

MIT License © 2025 FreshiFy Project
