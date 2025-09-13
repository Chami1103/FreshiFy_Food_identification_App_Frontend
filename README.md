# Food Identification App

This repository contains backend and UI components for detecting food freshness using image processing and sensor data.

## Advanced Detection Screen

A new React Native `DetectionScreen` integrates image and gas sensor analysis:

- **Image Processing**: upload from camera or gallery and receive fruit type and freshness prediction from the Flask backend.
- **Gas Sensor Monitoring**: periodic requests to `/api/sensor` provide NH3 levels and RGB color values from the ESP32 setup.
- **Visualisations**: interactive color bars, NH3 trend line chart and color history bar chart.
- **Animated UI**: scanning animations and gradient cards for results.

### Dependencies

Install these packages in your React Native project:

```
npm install react-native-image-picker react-native-linear-gradient
npm install react-native-chart-kit react-native-vector-icons
npm install react-native-svg
```

Ensure the backend is reachable at `http://192.168.8.1:5000` or update the URLs in `DetectionScreen.js` accordingly.
