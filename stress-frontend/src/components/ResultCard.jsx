import React from "react";
import "./ResultCard.css";

const CONFIG = {
  stressed: {
    emoji: "🔴",
    label: "Stressed",
    className: "result-card--stressed",
    message: "Elevated stress detected. Please take a moment to breathe and relax.",
  },
  normal: {
    emoji: "🟢",
    label: "Normal",
    className: "result-card--normal",
    message: "Your stress levels appear normal. Keep it up!",
  },
};

export default function ResultCard({ prediction }) {
  const config = CONFIG[prediction?.toLowerCase()] ?? CONFIG.normal;

  return (
    <div className={`result-card ${config.className}`}>
      <div className="result-pulse-ring" />
      <div className="result-emoji">{config.emoji}</div>
      <div className="result-label">{config.label}</div>
      <p className="result-message">{config.message}</p>
    </div>
  );
}
