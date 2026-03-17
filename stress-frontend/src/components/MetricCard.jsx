import React from "react";
import "./MetricCard.css";

const icons = {
  adc: "⚡",
  pulse: "❤️",
  spo2: "🩸",
};

const units = {
  adc: "mV",
  pulse: "BPM",
  spo2: "%",
};

const labels = {
  adc: "ADC Signal",
  pulse: "Heart Rate",
  spo2: "SpO₂",
};

export default function MetricCard({ type, value }) {
  return (
    <div className={`metric-card metric-card--${type}`}>
      <span className="metric-icon">{icons[type]}</span>
      <div className="metric-info">
        <span className="metric-label">{labels[type]}</span>
        <span className="metric-value">
          {value !== undefined ? Number(value).toFixed(2) : "—"}
          <span className="metric-unit"> {units[type]}</span>
        </span>
      </div>
    </div>
  );
}
