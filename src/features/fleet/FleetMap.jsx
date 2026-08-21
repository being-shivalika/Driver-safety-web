import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RiskBadge } from '../../components/ui/RiskBadge';

// Create custom icons based on risk level
const createIcon = (color, isSmall = false) => {
  const size = isSmall ? 12 : 16;
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
};

const icons = {
  LOW: createIcon('#22c55e'),
  MODERATE: createIcon('#eab308'),
  HIGH: createIcon('#f97316'),
  CRITICAL: createIcon('#ef4444'),
  DEFAULT: createIcon('#94a3b8'),
  START: createIcon('#3b82f6', true), // Blue for start
  END: createIcon('#8b5cf6', true)    // Purple for end
};

export const FleetMap = ({ vehicles, onVehicleSelect }) => {
  const defaultCenter = [20.5937, 78.9629]; // Center of India
  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(5);

  useEffect(() => {
    if (vehicles && vehicles.length > 0) {
      // Calculate center based on vehicles current location
      const validVehicles = vehicles.filter(v => (v.currentLocation) || (v.latitude !== undefined && v.longitude !== undefined));
      if (validVehicles.length > 0) {
        const lats = validVehicles.map(v => v.currentLocation ? v.currentLocation.latitude : v.latitude);
        const lngs = validVehicles.map(v => v.currentLocation ? v.currentLocation.longitude : v.longitude);
        setCenter([
          (Math.min(...lats) + Math.max(...lats)) / 2,
          (Math.min(...lngs) + Math.max(...lngs)) / 2
        ]);
        setZoom(5);
      }
    }
  }, [vehicles]);

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        touchZoom={true}
        doubleClickZoom={true}
        dragging={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {vehicles.map((vehicle, idx) => {
          const rawLat = vehicle.currentLocation ? vehicle.currentLocation.latitude : vehicle.latitude;
          const rawLng = vehicle.currentLocation ? vehicle.currentLocation.longitude : vehicle.longitude;
          
          if (rawLat === undefined || rawLng === undefined || isNaN(rawLat) || isNaN(rawLng)) return null;
          
          // Add a tiny deterministic offset based on ID to prevent perfectly stacked markers for vehicles with identical DB coordinates
          const idNum = parseInt(String(vehicle.driverId || vehicle.id).replace(/\D/g, '') || idx) || idx;
          const lat = rawLat + ((idNum % 5) * 0.015);
          const lng = rawLng + ((idNum % 7) * 0.015);
          
          const currentPos = [lat, lng];
          
          // Support both mock format and new API format
          const hasRoute = (vehicle.route && vehicle.route.start && vehicle.route.end) || (vehicle.origin && vehicle.destination);
          
          let startPos = null;
          let endPos = null;
          
          if (vehicle.route && vehicle.route.start && vehicle.route.end) {
            startPos = [vehicle.route.start.latitude, vehicle.route.start.longitude];
            endPos = [vehicle.route.end.latitude, vehicle.route.end.longitude];
          }
          // The new API provides origin/destination as strings but not coordinates for them.
          // If we don't have startPos/endPos coordinates, we can't draw the Polyline.

          const formatStatus = (s) => {
            if (!s) return 'Unknown';
            return s.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
          };

          return (
            <React.Fragment key={vehicle.driverId || vehicle.id || Math.random()}>
              {/* Route Line */}
              {startPos && endPos && (
                <Polyline 
                  positions={[startPos, currentPos, endPos]} 
                  color="#94a3b8" 
                  weight={2} 
                  dashArray="5, 5" 
                  opacity={0.6}
                />
              )}

              {/* Start Marker */}
              {startPos && (
                <Marker position={startPos} icon={icons.START}>
                  <Popup>
                    <div className="text-xs font-semibold">Route Start</div>
                  </Popup>
                </Marker>
              )}

              {/* End Marker */}
              {endPos && (
                <Marker position={endPos} icon={icons.END}>
                  <Popup>
                    <div className="text-xs font-semibold">Route Destination</div>
                  </Popup>
                </Marker>
              )}

              {/* Current Vehicle Marker */}
              <Marker 
                position={currentPos}
                icon={icons[vehicle.riskLevel] || icons.DEFAULT}
                eventHandlers={{
                  click: () => onVehicleSelect && onVehicleSelect(vehicle)
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[200px]">
                    <div className="font-bold text-sm mb-1">{vehicle.driverName || vehicle.name}</div>
                    <div className="text-xs text-slate-500 mb-2">Vehicle: {vehicle.truckNumber || vehicle.vehicleNo || vehicle.vehicleRegistration}</div>
                    
                    {vehicle.riskLevel ? (
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <RiskBadge level={vehicle.riskLevel} />
                        <span className="text-xs font-semibold">Score: {vehicle.riskScore?.toFixed ? vehicle.riskScore.toFixed(1) : vehicle.riskScore}/100</span>
                      </div>
                    ) : (
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {formatStatus(vehicle.status)}
                        </span>
                      </div>
                    )}
                    
                    <div className="bg-slate-50 p-2 rounded text-[10px] mb-2 font-mono text-slate-600">
                      <div>Lat: {currentPos[0].toFixed(4)}</div>
                      <div>Lng: {currentPos[1].toFixed(4)}</div>
                    </div>
                    
                    {hasRoute && (
                      <div className="text-[10px] text-slate-500 mb-2 border-t border-slate-100 pt-2">
                        <span className="font-semibold text-slate-700">Route: </span>
                        {vehicle.origin || 'Start'} → {vehicle.destination || 'End'}
                      </div>
                    )}

                    {onVehicleSelect && (
                      <button 
                        onClick={() => onVehicleSelect(vehicle)}
                        className="w-full text-center text-xs text-fleet-accent font-medium mt-1 hover:underline"
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};
