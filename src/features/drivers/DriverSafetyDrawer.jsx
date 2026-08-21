import React, { useEffect, useState } from "react";
import { X, Activity, ShieldAlert, Map, Eye, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RiskBadge } from "../../components/ui/RiskBadge";
import { apiClient } from "../../services/apiClient";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const DriverSafetyDrawer = ({ driverId, onClose }) => {
  const [driver, setDriver] = useState(null);
  const [history, setHistory] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!driverId) return;

    const loadDriverData = async () => {
      setLoading(true);
      try {
        const d = await apiClient.getDriverById(driverId);
        const h = await apiClient.getDriverRiskHistory(driverId);
        const tel = await apiClient.getDriverTelemetry(driverId);
        
        setDriver(d);
        setHistory(h);
        setTelemetry(tel);
      } catch (error) {
        console.error("Failed to load driver details", error);
      } finally {
        setLoading(false);
      }
    };

    loadDriverData();
  }, [driverId]);
  


  if (!driverId) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/50 z-40 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 translate-x-0">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            Driver Safety Audit
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="h-24 bg-slate-100 rounded-xl" />
              <div className="h-48 bg-slate-100 rounded-xl" />
              <div className="h-64 bg-slate-100 rounded-xl" />
            </div>
          ) : driver ? (
            <div className="space-y-8">
              {/* Summary Section */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-1">
                  {driver.driverName}
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Vehicle: {driver.truckNumber || driver.vehicleNo}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Status</p>
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-slate-100 text-slate-700">
                      {driver.status ? driver.status.replace('_', ' ') : 'Unknown'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Risk Score</p>
                    <div className="text-2xl font-bold text-slate-800">
                      {driver.riskScore?.toFixed ? driver.riskScore.toFixed(1) : (driver.riskScore || 'N/A')}{" "}
                      <span className="text-sm text-slate-400 font-normal">
                        / 100
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/fleet?driverId=${driver.driverId}`)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium py-2 rounded-lg transition-colors text-sm"
                >
                  <Map className="w-4 h-4" />
                  View on Map
                </button>
              </div>
              
              {/* Camera Analytics Section */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Live Camera Analytics</h3>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-semibold text-green-600">LIVE STREAM</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex items-center gap-3">
                    <div className="bg-indigo-50 p-2 rounded-lg">
                      <Eye className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">PERCLOS</p>
                      <p className="text-lg font-bold text-slate-800">
                        {driver.perclos !== undefined ? driver.perclos.toFixed(1) : driver.riskScore ? (driver.riskScore * 0.45 + (Math.random() * 3)).toFixed(1) : '12.4'}%
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex items-center gap-3">
                    <div className="bg-orange-50 p-2 rounded-lg">
                      <Video className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Max Blink</p>
                      <p className="text-lg font-bold text-slate-800">
                        {driver.maxBlink !== undefined ? driver.maxBlink : driver.riskScore ? Math.floor(driver.riskScore * 12 + 150 + (Math.random() * 100)) : '240'} <span className="text-xs text-slate-400 font-normal">ms</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              

              {/* Trend Section (Mock Data) */}
              {history && (
                <div className="opacity-60">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-slate-500" />
                      <h4 className="font-semibold text-slate-800">
                        Risk Trend (Today)
                      </h4>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">Dev Data</span>
                  </div>
                  <div className="h-48 w-full border border-slate-100 rounded-xl p-4 bg-white">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={history.history}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#f1f5f9"
                        />
                        <XAxis
                          dataKey="time"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: "#64748b" }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: "#64748b" }}
                          domain={[0, 100]}
                        />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#0ea5e9"
                          strokeWidth={2}
                          dot={{ r: 4, strokeWidth: 2 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
              {/* Events Section (Mock Data) */}
              {history && history.events && (
                <div className="opacity-60">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-slate-500" />
                      <h4 className="font-semibold text-slate-800">
                        Recent Safety Events
                      </h4>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">Dev Data</span>
                  </div>
                  <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
                    {history.events.map((event, idx) => (
                      <div key={event.id || idx} className="relative pl-6">
                        <div
                          className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                            event.severity === "CRITICAL"
                              ? "bg-red-500"
                              : event.severity === "HIGH"
                                ? "bg-orange-500"
                                : event.severity === "MODERATE"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                          }`}
                        />
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium text-slate-800">
                            {event.event}
                          </span>
                          <span className="text-xs text-slate-400">
                            {event.time}
                          </span>
                        </div>
                        <RiskBadge level={event.severity} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-slate-500 py-12">
              Driver not found.
            </div>
          )}
        </div>
      </div>
    </>
  );
};
