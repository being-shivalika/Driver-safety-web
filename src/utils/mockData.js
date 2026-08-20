// Mock data for VigilDrive Dashboard

export const MOCK_DRIVERS = [
  {
    driver_id: 'D001',
    truck_id: 'TRK-001',
    driver_name: 'Rajesh Kumar',
    vehicle_no: 'KA-01-AB-1234',
    route: {
      start: { latitude: 12.9716, longitude: 77.5946 }, // Bangalore
      end: { latitude: 12.2958, longitude: 76.6394 } // Mysore
    },
    currentLocation: { latitude: 12.6333, longitude: 77.1000 },
    riskLevel: 'LOW',
    riskScore: 12,
    lastCheck: new Date(Date.now() - 1000 * 60 * 2).toISOString()
  },
  {
    driver_id: 'D002',
    truck_id: 'TRK-002',
    driver_name: 'Suresh Singh',
    vehicle_no: 'MH-02-CD-5678',
    route: {
      start: { latitude: 19.0760, longitude: 72.8777 }, // Mumbai
      end: { latitude: 18.5204, longitude: 73.8567 } // Pune
    },
    currentLocation: { latitude: 18.7900, longitude: 73.3600 },
    riskLevel: 'CRITICAL',
    riskScore: 87,
    lastCheck: new Date(Date.now() - 1000 * 60 * 1).toISOString()
  },
  {
    driver_id: 'D003',
    truck_id: 'TRK-003',
    driver_name: 'Amit Patel',
    vehicle_no: 'GJ-03-EF-9012',
    route: {
      start: { latitude: 23.0225, longitude: 72.5714 }, // Ahmedabad
      end: { latitude: 21.1702, longitude: 72.8311 } // Surat
    },
    currentLocation: { latitude: 22.0900, longitude: 72.7000 },
    riskLevel: 'MODERATE',
    riskScore: 45,
    lastCheck: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  }
];

export const MOCK_ALERTS = [
  { id: 'A001', severity: 'CRITICAL', driverId: 'D002', vehicleId: 'TRK-002', description: 'Critical fatigue detected: Extended eye closure', riskScore: 87, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), resolved: false },
  { id: 'A002', severity: 'MODERATE', driverId: 'D003', vehicleId: 'TRK-003', description: 'Moderate fatigue: Increased blink rate', riskScore: 45, timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), resolved: false }
];

export const MOCK_TRIPS = [
  { id: 'T001', date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), driverId: 'D001', vehicleId: 'TRK-001', route: 'Bangalore to Mysore', maxRiskScore: 15, status: 'COMPLETED' },
  { id: 'T002', date: new Date().toISOString(), driverId: 'D002', vehicleId: 'TRK-002', route: 'Mumbai to Pune', maxRiskScore: 87, status: 'IN_PROGRESS' },
  { id: 'T003', date: new Date().toISOString(), driverId: 'D003', vehicleId: 'TRK-003', route: 'Ahmedabad to Surat', maxRiskScore: 45, status: 'IN_PROGRESS' }
];

export const MOCK_RISK_HISTORY = [
  { time: '10:00 AM', score: 12 },
  { time: '11:00 AM', score: 15 },
  { time: '12:00 PM', score: 35 },
  { time: '01:00 PM', score: 55 },
  { time: '02:00 PM', score: 87 },
];

export const MOCK_EVENTS = [
  { id: 'E1', time: '10:00 AM', event: 'Trip started', severity: 'LOW' },
  { id: 'E2', time: '12:00 PM', event: 'Yawn detected', severity: 'MODERATE' },
  { id: 'E3', time: '01:00 PM', event: 'Rest suggested', severity: 'MODERATE' },
  { id: 'E4', time: '02:00 PM', event: 'Extended eye closure detected', severity: 'CRITICAL' },
  { id: 'E5', time: '02:05 PM', event: 'Fatigue threshold exceeded', severity: 'CRITICAL' },
];
