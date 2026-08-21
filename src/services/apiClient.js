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
    
    let lowRisk = 0;
    let moderateRisk = 0;
    let highRisk = 0;
    let criticalRisk = 0;

    drivers.forEach(d => {
      if (d.riskLevel === 'LOW') lowRisk++;
      else if (d.riskLevel === 'MODERATE') moderateRisk++;
      else if (d.riskLevel === 'HIGH') highRisk++;
      else if (d.riskLevel === 'CRITICAL') criticalRisk++;
      // Ignore PENDING drivers for risk counts
    });
    
    return {
      totalVehicles,
      activeTrips,
      lowRisk,
      moderateRisk,
      highRisk,
      criticalRisk
    };
  },

  async getDriverInfo() {
    try {
      const [infoRes, dataRes] = await Promise.all([
        fetch('https://vigildrivebackend.onrender.com/api/v2/driverinfo/'),
        fetch('https://vigildrivebackend.onrender.com/api/v2/driverdata/')
      ]);

      if (!infoRes.ok) {
        throw new Error(`Failed to fetch driver info: ${infoRes.statusText}`);
      }

      const infoData = await infoRes.json();
      const telemetryData = dataRes.ok ? await dataRes.json() : [];

      // If API returns data, use it
      if (Array.isArray(infoData) && infoData.length > 0) {
        return infoData.map(d => {
          // Join with driverdata based on truck_id (best) or fallback to internal 'id' (legacy)
          const telemetry = Array.isArray(telemetryData) 
            ? telemetryData.find(t => (t.truck_id && t.truck_id === d.truck_id) || t.id === d.id) 
            : null;
          
          return {
            driverId: d.truck_id, // UI uses truck_id as the unique key
            driverName: d.driver,
            truckId: d.truck_id,
            truckNumber: d.truck_no,
            origin: d.start_point,
            destination: d.end_point,
            latitude: Number(d.lat),
            longitude: Number(d.lon),
            status: d.status,
            riskLevel: telemetry ? (telemetry.risk_level || 'LOW') : 'LOW',
            riskScore: telemetry ? (telemetry.overall_risk_score || 0) : 0,
            perclos: telemetry?.final_perclos,
            maxBlink: telemetry?.max_blink_duration_ms
          };
        });
      }
      
      console.warn("API returned empty array. Using fallback data for preview.");
    } catch (error) {
      console.warn("API is unavailable (502/Error). Using fallback data for preview.", error);
    }
    
    // Fallback: Display at least one driver from mock data so the dashboard isn't empty
    return MOCK_DRIVERS.map(d => ({
      driverId: d.truck_id,
      driverName: d.driver_name,
      truckId: d.truck_id,
      truckNumber: d.vehicle_no,
      origin: 'Delhi (Mock)',
      destination: 'Mumbai (Mock)',
      latitude: d.currentLocation?.latitude || 28.6139,
      longitude: d.currentLocation?.longitude || 77.2090,
      status: 'IN_PROGRESS',
      riskLevel: d.riskLevel,
      riskScore: d.riskScore
    }));
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
    try {
      const payload = {
        driver: data.driverName,
        truck_id: data.truckId,
        truck_no: data.vehicleNo,
        start_point: data.startPoint || "Not Assigned",
        end_point: data.endPoint || "Not Assigned",
        lat: "28.6139", // Default starting coords
        lon: "77.2090",
        status: "IN_PROGRESS"
      };

      const response = await fetch('https://vigildrivebackend.onrender.com/api/v2/driverinfo/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to register driver: ${response.statusText}`);
      }
      
      const newDriver = await response.json();
      
      return {
        driver_id: newDriver.id,
        truck_id: newDriver.truck_id,
        driver_name: newDriver.driver,
        vehicle_no: newDriver.truck_no
      };
    } catch (error) {
      console.error("Error registering driver:", error);
      throw error;
    }
  },

  async getDriverRiskHistory(id) {
    await delay(400);
    const driver = await this.getDriverById(id);
    
    if (!driver) {
      return { history: [], events: [] };
    }
    
    const currentScore = driver.riskScore || 0;
    
    // Generate a realistic fatigue curve that ends at the driver's current real/mock score
    const history = [
      { time: '10:00 AM', score: Math.max(0, Math.floor(currentScore * 0.2)) },
      { time: '11:00 AM', score: Math.max(0, Math.floor(currentScore * 0.4)) },
      { time: '12:00 PM', score: Math.max(0, Math.floor(currentScore * 0.6)) },
      { time: '01:00 PM', score: Math.max(0, Math.floor(currentScore * 0.8)) },
      { time: '02:00 PM', score: currentScore },
    ];

    // Generate dynamic events based on the risk score
    const generateEvents = (score) => {
      const events = [
        { id: 'E1', time: '10:00 AM', event: 'Trip started', severity: 'LOW' }
      ];
      
      if (score > 30) {
        events.push({ id: 'E2', time: '12:00 PM', event: 'Yawn detected', severity: 'MODERATE' });
      }
      if (score > 50) {
        events.push({ id: 'E3', time: '01:00 PM', event: 'Rest suggested', severity: 'MODERATE' });
      }
      if (score > 70) {
        events.push({ id: 'E4', time: '01:30 PM', event: 'Extended eye closure detected', severity: 'HIGH' });
      }
      if (score > 85) {
        events.push({ id: 'E5', time: '02:00 PM', event: 'Fatigue threshold exceeded', severity: 'CRITICAL' });
      }
      
      if (score <= 30) {
        events.push({ id: 'E2', time: '12:30 PM', event: 'Routine safety check passed', severity: 'LOW' });
      }
      
      return events;
    };

    return {
      history,
      events: generateEvents(currentScore)
    };
  },

  async getAlerts() {
    await delay(500);
    const drivers = await this.getDriverInfo();
    
    const dynamicAlerts = [];
    let alertIdCounter = 1;
    
    drivers.forEach(driver => {
      if (driver.riskLevel === 'CRITICAL' || driver.riskLevel === 'HIGH') {
        dynamicAlerts.push({
          id: `A00${alertIdCounter++}`,
          severity: driver.riskLevel,
          driverId: driver.driverId,
          vehicleId: driver.truckId,
          description: driver.riskLevel === 'CRITICAL' ? 'Critical fatigue detected: Extended eye closure' : 'High fatigue: Frequent yawning',
          riskScore: driver.riskScore,
          timestamp: new Date(Date.now() - 1000 * 60 * Math.floor(Math.random() * 30)).toISOString(),
          resolved: false,
          driver: driver
        });
      }
    });

    return dynamicAlerts.sort((a, b) => b.riskScore - a.riskScore);
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
