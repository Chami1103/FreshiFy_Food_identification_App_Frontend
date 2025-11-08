import React from "react";
import { ExpoRoot } from "expo-router";

export default function App() {
  const ctx = (require as any).context("./app", true, /\.tsx?$/);
  return <ExpoRoot context={ctx} />;
}
