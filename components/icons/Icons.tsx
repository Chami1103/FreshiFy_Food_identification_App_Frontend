// components/icons/Icons.tsx
import React from "react";
import Svg, { Path, Circle, Polyline, Line, Rect, Polygon } from "react-native-svg";

export interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  style?: any;
  className?: string; // ✅ allows harmless JSX usage, ignored internally
}

// Helper to ignore className gracefully
const parseStyle = (style?: any, _className?: string) => style;

export const HomeIcon: React.FC<IconProps> = ({ width = 24, height = 24, color = "currentColor", style, className }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={parseStyle(style, className)}>
    <Path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Polyline points="9 22 9 12 15 12 15 22" />
  </Svg>
);

export const UploadCloudIcon: React.FC<IconProps> = ({ width = 24, height = 24, color = "#0ea5e9", style, className }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={parseStyle(style, className)}>
    <Path d="M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24" />
    <Path d="M12 12v9" />
    <Path d="m16 16-4-4-4 4" />
  </Svg>
);

export const CameraIcon: React.FC<IconProps> = ({ width = 24, height = 24, color = "#eab308", style, className }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={parseStyle(style, className)}>
    <Path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <Circle cx="12" cy="13" r="3" />
  </Svg>
);

export const RssIcon: React.FC<IconProps> = ({ width = 24, height = 24, color = "#0ea5e9", style, className }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={parseStyle(style, className)}>
    <Path d="M4 11a9 9 0 0 1 9 9" />
    <Path d="M4 4a16 16 0 0 1 16 16" />
    <Circle cx="5" cy="19" r="1" />
  </Svg>
);

export const BellIcon: React.FC<IconProps> = ({ width = 24, height = 24, color = "#10b981", style, className }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={parseStyle(style, className)}>
    <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <Path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </Svg>
);

export const SunIcon: React.FC<IconProps> = ({ width = 24, height = 24, color = "#facc15", style, className }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={parseStyle(style, className)}>
    <Circle cx="12" cy="12" r="4" />
    <Path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </Svg>
);

export const MoonIcon: React.FC<IconProps> = ({ width = 24, height = 24, color = "#fbbf24", style, className }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={parseStyle(style, className)}>
    <Path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </Svg>
);

export const KeyRoundIcon: React.FC<IconProps> = ({ width = 24, height = 24, color = "#eab308", style, className }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={parseStyle(style, className)}>
    <Path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" />
    <Circle cx="16.5" cy="7.5" r=".5" />
  </Svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ width = 24, height = 24, color = "#0ea5e9", style, className }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={parseStyle(style, className)}>
    <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <Polyline points="7 10 12 15 17 10" />
    <Line x1="12" y1="15" x2="12" y2="3" />
  </Svg>
);

export const InfoIcon: React.FC<IconProps> = ({ width = 24, height = 24, color = "#0ea5e9", style, className }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={parseStyle(style, className)}>
    <Circle cx="12" cy="12" r="10" />
    <Line x1="12" y1="16" x2="12" y2="12" />
    <Line x1="12" y1="8" x2="12.01" y2="8" />
  </Svg>
);

export const AlertCircleIcon: React.FC<IconProps> = ({ width = 24, height = 24, color = "#facc15", style, className }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={parseStyle(style, className)}>
    <Circle cx="12" cy="12" r="10" />
    <Line x1="12" y1="8" x2="12" y2="12" />
    <Line x1="12" y1="16" x2="12.01" y2="16" />
  </Svg>
);

export const XIcon: React.FC<IconProps> = ({ width = 24, height = 24, color = "#ef4444", style, className }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={parseStyle(style, className)}>
    <Line x1="18" y1="6" x2="6" y2="18" />
    <Line x1="6" y1="6" x2="18" y2="18" />
  </Svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ width = 24, height = 24, color = "#10b981", style, className }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={parseStyle(style, className)}>
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <Polyline points="22 4 12 14.01 9 11.01" />
  </Svg>
);

export const ArrowDownIcon: React.FC<IconProps> = ({ width = 24, height = 24, color = "#10b981", style, className }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={parseStyle(style, className)}>
    <Line x1="12" y1="5" x2="12" y2="19" />
    <Polyline points="19 12 12 19 5 12" />
  </Svg>
);
