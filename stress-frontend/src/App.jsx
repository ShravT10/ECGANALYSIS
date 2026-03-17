import React, { useState, useEffect, useRef } from "react";
import { fetchPrediction } from "./api";
import MetricCard from "./components/MetricCard";
import ResultCard from "./components/ResultCard";
import "./App.css";

const AUTO_REFRESH_INTERVAL = 5000;

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const intervalRef = useRef(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchPrediction();
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh logic
  useEffect(() => {
    if (autoRefresh) {
      loadData();
      intervalRef.current = setInterval(loadData, AUTO_REFRESH_INTERVAL);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [autoRefresh]);

  const formatTime = (date) =>
    date
      ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      : null;

  return (
    <div className="app">
      {/* Animated background orbs */}
      <div className="bg-orb bg-orb--1" />
      <div className="bg-orb bg-orb--2" />
      <div className="bg-orb bg-orb--3" />

      {/* ECG sweep line */}
      <div className="ecg-sweep" />

      <div className="container">
        {/* ── Header ── */}
        <header className="header">
          <div className="header-icon">
            <svg viewBox="0 0 64 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="ecg-logo">
              <polyline
                points="0,16 10,16 14,4 18,28 22,10 26,22 30,16 38,16 42,2 46,30 50,16 64,16"
                stroke="var(--color-accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          <div>
            <h1 className="header-title">ECG Stress Predictor</h1>
            <p className="header-sub">Real-time physiological stress analysis</p>
          </div>
        </header>

        {/* ── Controls ── */}
        <div className="controls">
          <button
            className="btn btn--primary"
            onClick={loadData}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <span className="btn-icon">⬇</span> Fetch Prediction
              </>
            )}
          </button>

          <label className="toggle-wrap">
            <div
              className={`toggle ${autoRefresh ? "toggle--on" : ""}`}
              onClick={() => setAutoRefresh((v) => !v)}
              role="switch"
              aria-checked={autoRefresh}
              tabIndex={0}
              onKeyDown={(e) => e.key === " " && setAutoRefresh((v) => !v)}
            >
              <div className="toggle-knob" />
            </div>
            <span className="toggle-label">
              Auto-refresh <span className="toggle-hint">(every 5 s)</span>
            </span>
          </label>

          {lastUpdated && (
            <span className="last-updated">
              🕐 Last updated: {formatTime(lastUpdated)}
            </span>
          )}
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div className="error-banner" role="alert">
            <span className="error-icon">⚠️</span>
            <div>
              <strong>Could not fetch data</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* ── Data Panel ── */}
        {data && (
          <div className="data-panel" key={lastUpdated?.getTime()}>
            {/* Sensor Metrics - Only show if at least one sensor value is present */}
            {(data.adc !== undefined || data.pulse !== undefined || data.spo2 !== undefined) && (
              <section className="metrics-section">
                <h2 className="section-title">Sensor Readings</h2>
                <div className="metrics-grid">
                  <MetricCard type="adc"   value={data.adc} />
                  <MetricCard type="pulse" value={data.pulse} />
                  <MetricCard type="spo2"  value={data.spo2} />
                </div>
              </section>
            )}

            {/* Prediction Result */}
            <section className="result-section">
              <h2 className="section-title">Stress Analysis</h2>
              <ResultCard prediction={data.prediction} />
            </section>
          </div>
        )}

        {/* ── Empty State ── */}
        {!data && !loading && !error && (
          <div className="empty-state">
            <div className="empty-icon">📡</div>
            <p>Click <strong>Fetch Prediction</strong> or enable auto-refresh to load live data</p>
          </div>
        )}
      </div>
    </div>
  );
}
