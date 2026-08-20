import React, { useEffect, useState } from 'react';
import { Search, Filter, Plus, X, CheckCircle } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { RiskBadge } from '../components/ui/RiskBadge';
import { DriverSafetyDrawer } from '../features/drivers/DriverSafetyDrawer';

export const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  
  // Registration State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [regData, setRegData] = useState({ driverName: '', truckId: '', vehicleNo: '' });
  const [successData, setSuccessData] = useState(null);

  const loadDrivers = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getDrivers();
      setDrivers(data);
    } catch (error) {
      console.error("Failed to load drivers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  const filteredDrivers = drivers.filter(d => {
    if (filter !== 'ALL' && d.status !== filter) return false;
    const nameMatch = d.driverName?.toLowerCase().includes(search.toLowerCase());
    const vehicleMatch = d.truckNumber?.toLowerCase().includes(search.toLowerCase());
    if (search && !nameMatch && !vehicleMatch) return false;
    return true;
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegistering(true);
    try {
      const response = await apiClient.registerDriver(regData);
      setSuccessData(response);
      setRegData({ driverName: '', truckId: '', vehicleNo: '' });
      await loadDrivers();
    } catch (error) {
      console.error("Registration failed", error);
    } finally {
      setRegistering(false);
    }
  };

  const closeRegisterModal = () => {
    setIsRegisterOpen(false);
    setSuccessData(null);
    setRegData({ driverName: '', truckId: '', vehicleNo: '' });
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search driver or vehicle..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fleet-accent/50 focus:border-fleet-accent"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 overflow-x-auto mr-4">
            <Filter className="w-4 h-4 text-slate-400 mr-2" />
            {['ALL', ...Array.from(new Set(drivers.map(d => d.status).filter(Boolean)))].map(status => (
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
          <button 
            onClick={() => setIsRegisterOpen(true)}
            className="flex items-center gap-2 bg-fleet-accent hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Driver
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 sticky top-0 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Driver</th>
                <th className="px-6 py-4 font-medium">Truck ID</th>
                <th className="px-6 py-4 font-medium">Vehicle No.</th>
                <th className="px-6 py-4 font-medium">Route</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-48"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded-full w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No drivers found.
                  </td>
                </tr>
              ) : (
                filteredDrivers.map(driver => {
                  const formatStatus = (s) => {
                    if (!s) return 'Unknown';
                    return s.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
                  };

                  return (
                    <tr key={driver.driverId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{driver.driverName}</td>
                      <td className="px-6 py-4">{driver.truckId}</td>
                      <td className="px-6 py-4">{driver.truckNumber}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {driver.origin && driver.destination ? `${driver.origin} → ${driver.destination}` : 'Not Assigned'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {formatStatus(driver.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedDriverId(driver.driverId)}
                          className="text-fleet-accent font-medium hover:underline px-3 py-1 bg-fleet-accent/10 rounded-lg hover:bg-fleet-accent/20 transition-colors text-xs"
                        >
                          View
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

      {selectedDriverId && (
        <DriverSafetyDrawer 
          driverId={selectedDriverId} 
          onClose={() => setSelectedDriverId(null)} 
        />
      )}

      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                {successData ? 'Driver Registered Successfully' : 'NEW DRIVER REGISTRATION'}
              </h3>
              <button onClick={closeRegisterModal} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {successData ? (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Driver ID</span>
                      <span className="font-medium text-slate-800">{successData.driver_id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Truck ID</span>
                      <span className="font-medium text-slate-800">{successData.truck_id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Driver Name</span>
                      <span className="font-medium text-slate-800">{successData.driver_name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Vehicle No.</span>
                      <span className="font-medium text-slate-800">{successData.vehicle_no}</span>
                    </div>
                  </div>
                  <button
                    onClick={closeRegisterModal}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 rounded-lg transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Driver Name</label>
                    <input 
                      type="text" 
                      required
                      value={regData.driverName}
                      onChange={e => setRegData({...regData, driverName: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-fleet-accent focus:ring-1 focus:ring-fleet-accent"
                      placeholder="e.g. Raj Kumar"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Truck ID</label>
                    <input 
                      type="text" 
                      required
                      value={regData.truckId}
                      onChange={e => setRegData({...regData, truckId: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-fleet-accent focus:ring-1 focus:ring-fleet-accent"
                      placeholder="e.g. TRK-014"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Number</label>
                    <input 
                      type="text" 
                      required
                      value={regData.vehicleNo}
                      onChange={e => setRegData({...regData, vehicleNo: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-fleet-accent focus:ring-1 focus:ring-fleet-accent"
                      placeholder="e.g. HR38AB1234"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeRegisterModal}
                      className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={registering}
                      className="flex-1 px-4 py-2 bg-fleet-accent hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-70 flex justify-center items-center"
                    >
                      {registering ? 'Registering...' : 'Register Driver'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
