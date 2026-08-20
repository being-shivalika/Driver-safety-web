import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../components/ui/StatCard';
import { AlertCard } from '../components/ui/AlertCard';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { FleetMap } from '../features/fleet/FleetMap';
import { DriverSafetyDrawer } from '../features/drivers/DriverSafetyDrawer';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriverId, setSelectedDriverId] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [sum, vehi, alrts] = await Promise.all([
          apiClient.getDashboardSummary(),
          apiClient.getFleetVehicles(),
          apiClient.getAlerts()
        ]);
        setSummary(sum);
        setVehicles(vehi);
        setAlerts(alrts.slice(0, 3)); // Only show top 3 alerts
      } catch (error) {
        console.error("Failed to load dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const riskyVehicles = vehicles.filter(v => v.riskLevel && v.riskLevel !== 'LOW').sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0)).slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-24 bg-slate-200 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[400px] bg-slate-200 rounded-xl" />
          <div className="h-[400px] bg-slate-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-fleet-navy text-white rounded-xl p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name || 'Admin User'} 👋</h1>
          <p className="text-slate-400 text-sm">Here is what is happening across your fleet today.</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 flex items-center gap-6 border border-slate-700">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Total Fleet</p>
            <p className="text-xl font-bold text-slate-200">{summary?.totalVehicles || 0}</p>
          </div>
          <div className="w-px h-8 bg-slate-700"></div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">On Journey</p>
            <p className="text-2xl font-bold text-fleet-accent">{summary?.activeTrips || 0}</p>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards (Risk Breakdown) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Low Risk" value={summary?.lowRisk || 0} type="low" icon={<ShieldCheck className="w-5 h-5 text-green-700" />} />
        <StatCard title="Moderate" value={summary?.moderateRisk || 0} type="moderate" icon={<Info className="w-5 h-5 text-yellow-700" />} />
        <StatCard title="High" value={summary?.highRisk || 0} type="high" icon={<AlertTriangle className="w-5 h-5 text-orange-700" />} />
        <StatCard title="Critical" value={summary?.criticalRisk || 0} type="critical" icon={<AlertOctagon className="w-5 h-5 text-red-700" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Map */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 h-[450px] flex flex-col">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Live Fleet Status</h2>
            <div className="flex-1 rounded-lg overflow-hidden relative z-0">
              <FleetMap vehicles={vehicles} onVehicleSelect={(v) => setSelectedDriverId(v.driverId)} />
            </div>
          </div>
        </div>

        {/* Right Column - Active Risks & Alerts */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Active Safety Risks</h2>
              <button onClick={() => navigate('/drivers')} className="text-sm text-fleet-accent hover:underline">View All</button>
            </div>
            
            {riskyVehicles.length > 0 ? (
              <div className="space-y-4">
                {riskyVehicles.map(v => (
                  <div key={v.driverId} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50">
                    <div>
                      <div className="font-medium text-sm text-slate-800">{v.driverName}</div>
                      <div className="text-xs text-slate-500">{v.vehicleNo}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-sm ${v.riskLevel === 'CRITICAL' ? 'text-red-600' : v.riskLevel === 'HIGH' ? 'text-orange-600' : 'text-yellow-600'}`}>
                        {v.riskScore?.toFixed ? v.riskScore.toFixed(1) : v.riskScore}/100
                      </div>
                      <button onClick={() => setSelectedDriverId(v.driverId)} className="text-xs text-fleet-accent hover:underline mt-1">View</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-slate-500">No active high risks.</div>
            )}
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-800">CRITICAL SAFETY</h2>
              <button onClick={() => navigate('/drivers')} className="text-sm text-fleet-accent hover:underline">View Drivers</button>
            </div>
            <div className="space-y-3">
              {alerts.length > 0 ? alerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} onClick={() => setSelectedDriverId(alert.driverId)} />
              )) : (
                <div className="text-center py-4 text-sm text-slate-500">No critical alerts.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedDriverId && (
        <DriverSafetyDrawer 
          driverId={selectedDriverId} 
          onClose={() => setSelectedDriverId(null)} 
        />
      )}
    </div>
  );
};
