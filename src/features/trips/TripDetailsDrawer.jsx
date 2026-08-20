import React, { useEffect, useState } from 'react';
import { X, MapPin, Calendar, Activity } from 'lucide-react';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { apiClient } from '../../services/apiClient';

export const TripDetailsDrawer = ({ tripId, onClose }) => {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tripId) return;
    
    const loadTripData = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getTripById(tripId);
        setTrip(data);
      } catch (error) {
        console.error("Failed to load trip details", error);
      } finally {
        setLoading(false);
      }
    };

    loadTripData();
  }, [tripId]);

  if (!tripId) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 z-40 transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 translate-x-0">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Trip Details</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="h-32 bg-slate-100 rounded-xl" />
              <div className="h-64 bg-slate-100 rounded-xl" />
            </div>
          ) : trip ? (
            <div className="space-y-8">
              {/* Trip Info */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${trip.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {trip.status}
                  </span>
                  <div className="flex items-center text-xs text-slate-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(trip.date).toLocaleDateString()}
                  </div>
                </div>
                
                <h3 className="font-bold text-slate-800 mb-1">{trip.route}</h3>
                <div className="flex items-center text-sm text-slate-600 mb-4">
                  <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                  Driver: {trip.driver?.driverName} ({trip.driver?.vehicleNo})
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">Max Risk Score During Trip</p>
                  <div className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    {trip.maxRiskScore} 
                    <RiskBadge level={trip.maxRiskScore > 85 ? 'CRITICAL' : trip.maxRiskScore > 65 ? 'HIGH' : trip.maxRiskScore > 30 ? 'MODERATE' : 'LOW'} />
                  </div>
                </div>
              </div>

              {/* Event Timeline */}
              {trip.events && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-4 h-4 text-slate-500" />
                    <h4 className="font-semibold text-slate-800">Trip Event Log</h4>
                  </div>
                  <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
                    {trip.events.map((event, idx) => (
                      <div key={event.id || idx} className="relative pl-6">
                        <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                          event.severity === 'CRITICAL' ? 'bg-red-500' :
                          event.severity === 'HIGH' ? 'bg-orange-500' :
                          event.severity === 'MODERATE' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium text-slate-800">{event.event}</span>
                          <span className="text-xs text-slate-400">{event.time}</span>
                        </div>
                        <RiskBadge level={event.severity} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-slate-500 py-12">Trip not found.</div>
          )}
        </div>
      </div>
    </>
  );
};
