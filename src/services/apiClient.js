import { MOCK_DRIVERS, MOCK_ALERTS, MOCK_TRIPS, MOCK_RISK_HISTORY, MOCK_EVENTS } from '../utils/mockData';

// Simulated delay for realistic loading states
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://driver-safety-2-1.onrender.com';

const normalizeDriver = (d) => ({
  driverId: d.driver_id,
  truckId: d.truck_id,
  driverName: d.driver_name,
  vehicleNo: d.vehicle_no,
  route: d.route,
  currentLocation: d.currentLocation,
  riskLevel: d.riskLevel || 'LOW',
  riskScore: d.riskScore || 0,
  lastCheck: d.lastCheck || new Date().toISOString()
});

const normalizeDriverInfo = (d) => ({
  driverId: d.truck_id, // mapping to truck_id to maintain compatibility with existing UI keys
  driverName: d.driver,
  truckId: d.truck_id,
  truckNumber: d.truck_no,
  origin: d.start_point,
  destination: d.end_point,
  latitude: Number(d.lat),
  longitude: Number(d.lon),
  status: d.status
});



// Currently using mock data for fleet, real data for video analysis
export const apiClient = {
  async getDashboardSummary() {
    await delay(500);
    const drivers = await this.getDriverInfo();
    const totalVehicles = drivers.length;
    // We no longer have mock activeTrips or risks natively from driver API unless status represents active trip
    const activeTrips = drivers.filter(d => d.status === 'in_progress' || d.status === 'IN_PROGRESS').length;
    
    return {
      totalVehicles,
      activeTrips,
      lowRisk: 0,
      moderateRisk: 0,
      highRisk: 0,
      criticalRisk: 0
    };
  },

  async getDriverInfo() {
    const response = await fetch('https://vigildrivebackend.onrender.com/api/v2/driverinfo/');
    if (!response.ok) {
      throw new Error(`Failed to fetch driver info: ${response.statusText}`);
    }
    const data = await response.json();
    return data.map(normalizeDriverInfo);
  },

  async getFleetVehicles() {
    return this.getDriverInfo();
  },

  async getDrivers() {
    return this.getDriverInfo();
  },

  async getDriverById(id) {
    const drivers = await this.getDriverInfo();
    return drivers.find(d => d.truckId === id) || null;
  },

  async registerDriver(data) {
    await delay(800);
    // Simulate backend response
    const newDriver = {
      driver_id: `DRV-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      truck_id: data.truckId,
      driver_name: data.driverName,
      vehicle_no: data.vehicleNo,
      route: {
        start: { latitude: 0, longitude: 0 },
        end: { latitude: 0, longitude: 0 }
      },
      currentLocation: null,
      riskLevel: 'LOW',
      riskScore: 0,
      lastCheck: new Date().toISOString()
    };
    
    // In a real app, this would be a POST request. For our mock, we just push to the array.
    MOCK_DRIVERS.push(newDriver);
    
    // Return backend contract format
    return {
      driver_id: newDriver.driver_id,
      truck_id: newDriver.truck_id,
      driver_name: newDriver.driver_name,
      vehicle_no: newDriver.vehicle_no
    };
  },

  async getDriverRiskHistory(id) {
    await delay(400);
    return {
      history: MOCK_RISK_HISTORY,
      events: MOCK_EVENTS
    };
  },

  async getAlerts() {
    await delay(500);
    const drivers = await this.getDriverInfo();
    return MOCK_ALERTS.map(alert => ({
      ...alert,
      driver: drivers.find(d => d.driverId === alert.driverId) || {}
    }));
  },

  async getTrips() {
    await delay(500);
    const drivers = await this.getDriverInfo();
    return MOCK_TRIPS.map(trip => {
      const driver = drivers.find(d => d.driverId === trip.driverId);
      return {
        ...trip,
        driver: driver || null
      };
    });
  },

  async getTripById(id) {
    await delay(400);
    const trip = MOCK_TRIPS.find(t => t.id === id);
    if (!trip) return null;
    const drivers = await this.getDriverInfo();
    const driver = drivers.find(d => d.driverId === trip.driverId);
    return {
      ...trip,
      driver: driver || null,
      events: MOCK_EVENTS
    };
  },


};
