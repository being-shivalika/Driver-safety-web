import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { RiskBadge } from '../components/ui/RiskBadge';
import { TripDetailsDrawer } from '../features/trips/TripDetailsDrawer';

export const TripHistoryPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTripId, setSelectedTripId] = useState(null);

  useEffect(() => {
    const loadTrips = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getTrips();
        setTrips(data);
      } catch (error) {
        console.error("Failed to load trips", error);
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, []);

  const filteredTrips = trips.filter(t => {
    if (search && !t.driver?.driverName?.toLowerCase().includes(search.toLowerCase()) && !t.route.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by driver or route..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fleet-accent/50 focus:border-fleet-accent"
          />
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 sticky top-0 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Driver</th>
                <th className="px-6 py-4 font-medium">Vehicle</th>
                <th className="px-6 py-4 font-medium">Route</th>
                <th className="px-6 py-4 font-medium">Max Risk</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-48"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded-full w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                    No trips found.
                  </td>
                </tr>
              ) : (
                filteredTrips.map(trip => {
                  const maxRiskLevel = trip.maxRiskScore > 85 ? 'CRITICAL' : trip.maxRiskScore > 65 ? 'HIGH' : trip.maxRiskScore > 30 ? 'MODERATE' : 'LOW';
                  return (
                    <tr key={trip.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-slate-800">{new Date(trip.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">{trip.driver?.driverName}</td>
                      <td className="px-6 py-4">{trip.driver?.vehicleNo}</td>
                      <td className="px-6 py-4">{trip.route}</td>
                      <td className="px-6 py-4">
                        <RiskBadge level={maxRiskLevel} />
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${trip.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {trip.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedTripId(trip.id)}
                          className="text-fleet-accent font-medium hover:underline px-3 py-1 bg-fleet-accent/10 rounded-lg hover:bg-fleet-accent/20 transition-colors text-xs"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTripId && (
        <TripDetailsDrawer 
          tripId={selectedTripId} 
          onClose={() => setSelectedTripId(null)} 
        />
      )}
    </div>
  );
};
