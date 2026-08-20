import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FleetMap } from '../features/fleet/FleetMap';
import { apiClient } from '../services/apiClient';
import { DriverSafetyDrawer } from '../features/drivers/DriverSafetyDrawer';
import { Search, Filter } from 'lucide-react';

export const LiveFleetPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDriverId = searchParams.get('driverId');
  const [selectedDriverId, setSelectedDriverId] = useState(initialDriverId || null);

  useEffect(() => {
    const loadFleet = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getFleetVehicles();
        setVehicles(data);
      } catch (error) {
        console.error("Failed to load fleet", error);
      } finally {
        setLoading(false);
      }
    };
    loadFleet();
  }, []);

  const handleDrawerClose = () => {
    setSelectedDriverId(null);
    if (searchParams.has('driverId')) {
      searchParams.delete('driverId');
      setSearchParams(searchParams);
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    if (filter !== 'ALL' && v.status !== filter) return false;
    const nameMatch = v.driverName?.toLowerCase().includes(search.toLowerCase());
    const vehicleMatch = v.vehicleNo?.toLowerCase().includes(search.toLowerCase());
    if (search && !nameMatch && !vehicleMatch) return false;
    return true;
  });

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search driver or vehicle..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fleet-accent/50 focus:border-fleet-accent"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 mr-2" />
          {['ALL', ...Array.from(new Set(vehicles.map(v => v.status).filter(Boolean)))].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filter === status 
                  ? 'bg-slate-800 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'ALL' ? 'ALL' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fleet-accent"></div>
          </div>
        ) : (
          <FleetMap vehicles={filteredVehicles} onVehicleSelect={(v) => setSelectedDriverId(v.driverId)} />
        )}
      </div>

      {selectedDriverId && (
        <DriverSafetyDrawer 
          driverId={selectedDriverId} 
          onClose={handleDrawerClose} 
        />
      )}
    </div>
  );
};
