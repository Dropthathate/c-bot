import { useEffect, useRef } from "react";

// Dynamic Chart.js import guard
let Chart;
try { Chart = (await import("chart.js/auto")).default; } catch { Chart = null; }

function LineChart({ id, data, labels, color }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!Chart || !ref.current) return;
    const ctx = ref.current.getContext("2d");
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          data,
          borderColor: color,
          backgroundColor: color.replace(")", ", 0.08)").replace("rgb", "rgba"),
          borderWidth: 2.5,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: color,
          pointRadius: 3,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 }, color: "#a1a1a6" } },
          y: { grid: { color: "rgba(0,0,0,0.04)" }, ticks: { font: { size: 10 }, color: "#a1a1a6" } },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} id={id} />;
}

function BarChart({ id, data, labels, color }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!Chart || !ref.current) return;
    const ctx = ref.current.getContext("2d");
    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: color.replace(")", ", 0.2)").replace("rgb", "rgba"),
          borderColor: color,
          borderWidth: 2,
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 }, color: "#a1a1a6" } },
          y: { grid: { color: "rgba(0,0,0,0.04)" }, ticks: { font: { size: 10 }, color: "#a1a1a6" } },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} id={id} />;
}

function DonutChart({ id, data, labels, colors }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!Chart || !ref.current) return;
    const ctx = ref.current.getContext("2d");
    const chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 6 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true, position: "bottom",
            labels: { font: { size: 10 }, color: "#6e6e73", boxWidth: 10, padding: 8 },
          },
        },
      },
    });
    return () => chart.destroy();
  }, []);
  return <canvas ref={ref} id={id} />;
}

export default function Analytics() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-sub">Practice performance · documentation trends · coding accuracy</p>
        </div>
        <div className="beta-warning">Beta — Illustrative data</div>
      </div>

      <div className="ai-disclaimer-bar">
        📊 Analytics shown are illustrative during beta. Connect your Supabase data for live metrics.
      </div>

      {/* KPI row */}
      <div className="stats-grid">
        {[
          { label: "Total Sessions",     value: "—",     color: "#30d9c0" },
          { label: "SOAP Notes Created", value: "—",     color: "#0a84ff" },
          { label: "Avg Confidence",     value: "88.5%", color: "#34c759" },
          { label: "Time Saved / Note",  value: "~18min",color: "#ff9f0a" },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="charts-3col">
        <div className="card chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">ICD-10 Accuracy</div>
            <div className="chart-card-sub">Confidence score over 8 weeks</div>
          </div>
          <div className="chart-wrap">
            <LineChart
              id="acc"
              labels={["W1","W2","W3","W4","W5","W6","W7","W8"]}
              data={[74, 78, 80, 82, 83, 85, 87, 88.5]}
              color="rgb(10,132,255)"
            />
          </div>
        </div>
        <div className="card chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">Documentation Speed</div>
            <div className="chart-card-sub">Minutes saved per session (vs. manual)</div>
          </div>
          <div className="chart-wrap">
            <BarChart
              id="speed"
              labels={["Mon","Tue","Wed","Thu","Fri","Sat"]}
              data={[18, 22, 19, 25, 28, 24]}
              color="rgb(48,217,192)"
            />
          </div>
        </div>
        <div className="card chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">Top Diagnoses</div>
            <div className="chart-card-sub">Most frequently coded conditions</div>
          </div>
          <div className="chart-wrap">
            <DonutChart
              id="dx"
              labels={["Cervicalgia","Low Back","Myalgia","Sciatica","Other"]}
              data={[28, 34, 18, 12, 8]}
              colors={["#30d9c0","#0a84ff","#ff9f0a","#bf5af2","#e8e8ed"]}
            />
          </div>
        </div>
      </div>

      {/* Big chart */}
      <div className="card chart-card" style={{ marginTop: 20 }}>
        <div className="chart-card-header">
          <div className="chart-card-title">Monthly Session Volume</div>
          <div className="chart-card-sub">Sessions processed over 12 months (illustrative)</div>
        </div>
        <div className="chart-wrap" style={{ height: 200 }}>
          <BarChart
            id="monthly"
            labels={["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]}
            data={[42, 58, 64, 72, 80, 88, 94, 102, 110, 98, 115, 124]}
            color="rgb(48,217,192)"
          />
        </div>
      </div>
    </div>
  );
}
