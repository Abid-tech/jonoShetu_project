import React, { useEffect, useState, useMemo } from "react";
import Heatmap from './Heatmap';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, ResponsiveContainer, Cell,
} from "recharts";
import "./Dashboard.css";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const GREEN = "#006a4e";

// ── Custom Tooltip ──────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", border: "1px solid #d5ebe2",
      borderRadius: 8, padding: "10px 14px", fontSize: "0.83rem",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
    }}>
      <p style={{ margin: 0, fontWeight: 600, color: "#1a3c34" }}>{label}</p>
      <p style={{ margin: "4px 0 0", color: GREEN }}>
        {payload[0].value} complaint{payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

function Dashboard() {
  const [monthlyData,  setMonthlyData]  = useState([]);
  const [areaRawData, setAreaRawData]   = useState([]);
  const [loading,     setLoading]       = useState(true);
  const [activeTab,   setActiveTab]     = useState("monthly"); // "monthly" | "area"

  // Area filters
  const [selectedYear,  setSelectedYear]  = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");

  // ── Fetch monthly data ─────────────────────────────────────────
  useEffect(() => {
    fetch("http://localhost:5000/analytics/monthly-comparison")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(item => ({
          month:       MONTH_NAMES[item._id.month - 1],
          year:        item._id.year,
          total:       item.totalComplaints,
          displayName: `${MONTH_NAMES[item._id.month - 1]} ${item._id.year}`,
        }));
        setMonthlyData(formatted);
      })
      .catch(err => console.error("Monthly data error:", err));
  }, []);

  // ── Fetch area-monthly data ────────────────────────────────────
  useEffect(() => {
    fetch("http://localhost:5000/analytics/area-monthly")
      .then(res => res.json())
      .then(data => { setAreaRawData(data); setLoading(false); })
      .catch(err => { console.error("Area data error:", err); setLoading(false); });
  }, []);

  // ── Derived: available filter options ─────────────────────────
  const availableYears = useMemo(() =>
    [...new Set(areaRawData.map(d => d._id.year))].sort(), [areaRawData]);

  const availableMonths = useMemo(() =>
    [...new Set(areaRawData.map(d => d._id.month))].sort((a,b) => a - b), [areaRawData]);

  // ── Filtered area rows ─────────────────────────────────────────
  const filteredAreaData = useMemo(() => {
    return areaRawData
      .filter(d => {
        const yearOk  = selectedYear  === "all" || d._id.year  === Number(selectedYear);
        const monthOk = selectedMonth === "all" || d._id.month === Number(selectedMonth);
        return yearOk && monthOk;
      })
      .map(d => ({
        district: d._id.district,
        month:    d._id.month,
        year:     d._id.year,
        count:    d.count,
      }))
      .sort((a,b) => b.count - a.count || a.district.localeCompare(b.district));
  }, [areaRawData, selectedYear, selectedMonth]);

  // ── Top 10 districts for bar chart ────────────────────────────
  const barData = useMemo(() => {
    const map = new Map();
    filteredAreaData.forEach(({ district, count }) => {
      map.set(district, (map.get(district) || 0) + count);
    });
    return Array.from(map, ([area, count]) => ({ area, count }))
      .sort((a,b) => b.count - a.count)
      .slice(0, 10);
  }, [filteredAreaData]);

  const maxBarCount = barData[0]?.count || 1;

  // ── Summary stats ──────────────────────────────────────────────
  const totalComplaints = useMemo(() =>
    monthlyData.reduce((s, d) => s + d.total, 0), [monthlyData]);

  const totalDistricts = useMemo(() =>
    new Set(areaRawData.map(d => d._id.district)).size, [areaRawData]);

  const peakMonth = useMemo(() => {
    if (!monthlyData.length) return "—";
    const peak = monthlyData.reduce((a,b) => b.total > a.total ? b : a);
    return peak.displayName;
  }, [monthlyData]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" />
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <h2 className="dashboard-title"> Complaint Analytics</h2>
      <p className="dashboard-subtitle">Monthly trends and area-wise breakdown of submitted complaints</p>

      {/* Stat cards */}
      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-label">Total Complaints</div>
          <div className="stat-value">{totalComplaints}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Districts Covered</div>
          <div className="stat-value">{totalDistricts}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Peak Month</div>
          <div className="stat-value" style={{ fontSize: "1.2rem", paddingTop: 6 }}>{peakMonth}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Months Recorded</div>
          <div className="stat-value">{monthlyData.length}</div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="tab-switcher">
        <button
          className={`tab-btn ${activeTab === "monthly" ? "active" : ""}`}
          onClick={() => setActiveTab("monthly")}
        >
          📈 Monthly Trend
        </button>
        <button
          className={`tab-btn ${activeTab === "area" ? "active" : ""}`}
          onClick={() => setActiveTab("area")}
        >
          🗺️ Area-wise
        </button>
      </div>

      {/* ── Tab: Monthly Comparison ──────────────────────────────── */}
      {activeTab === "monthly" && (
        <div className="dashboard-card">
          <h3>📈 Monthly Complaint Trend</h3>

          {monthlyData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8f0ec" />
                  <XAxis dataKey="displayName" tick={{ fontSize: 11, fill: "#7a9e90" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#7a9e90" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke={GREEN}
                    strokeWidth={2.5}
                    dot={{ r: 5, fill: GREEN, strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              {/* Monthly table */}
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Month</th>
                      <th>Year</th>
                      <th>Complaints</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...monthlyData]
                      .sort((a,b) => b.total - a.total)
                      .map((row, i) => (
                        <tr key={i}>
                          <td className="rank-col">{i + 1}</td>
                          <td><span className="badge-month">{row.month}</span></td>
                          <td><span className="badge-year">{row.year}</span></td>
                          <td className="num-col">{row.total}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No monthly data available yet</p>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Area-wise ───────────────────────────────────────── */}
      {activeTab === "area" && (
        <div className="dashboard-card">
          <h3>🗺️ Area-wise Complaints</h3>

          {/* Filters */}
          <div className="filter-row">
            <label>Year:</label>
            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
              <option value="all">All Years</option>
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            <label>Month:</label>
            <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
              <option value="all">All Months</option>
              {availableMonths.map(m => (
                <option key={m} value={m}>{MONTH_NAMES[m - 1]}</option>
              ))}
            </select>
          </div>

          {barData.length > 0 ? (
            <>
              {/* Horizontal bar chart — top 10 */}
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8f0ec" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#7a9e90" }} />
                  <YAxis
                    type="category"
                    dataKey="area"
                    width={120}
                    tick={{ fontSize: 11, fill: "#1a3c34" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {barData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={i === 0 ? "#006a4e" : i === 1 ? "#1d8f68" : "#4caf87"}
                        opacity={1 - i * 0.05}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Detailed table */}
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>District</th>
                      <th>Month</th>
                      <th>Year</th>
                      <th>Complaints</th>
                      <th style={{ minWidth: 140 }}>Distribution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAreaData.map((row, i) => (
                      <tr key={i}>
                        <td className="rank-col">{i + 1}</td>
                        <td style={{ fontWeight: 500 }}>{row.district}</td>
                        <td><span className="badge-month">{MONTH_NAMES[row.month - 1]}</span></td>
                        <td><span className="badge-year">{row.year}</span></td>
                        <td className="num-col">{row.count}</td>
                        <td>
                          <div className="bar-cell">
                            <div className="bar-fill-track">
                              <div
                                className="bar-fill"
                                style={{ width: `${(row.count / maxBarCount) * 100}%` }}
                              />
                            </div>
                            <span style={{ fontSize: "0.75rem", color: "#999", minWidth: 28 }}>
                              {Math.round((row.count / maxBarCount) * 100)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🗺️</div>
              <p>No area data for the selected filter</p>
            </div>
          )}
        </div>
      )}
      <Heatmap />
    </div>
  );
}

export default Dashboard;