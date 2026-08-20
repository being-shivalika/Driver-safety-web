import React from 'react';
import { AlertTriangle, Clock, ChevronRight } from 'lucide-react';
import { RiskBadge } from './RiskBadge';

export const AlertCard = ({ alert, onClick }) => {
  const isCritical = alert.severity === 'CRITICAL';
  
  return (
    <div 
      className={`p-4 rounded-lg border bg-white shadow-sm flex items-start gap-4 transition-colors ${onClick ? 'cursor-pointer hover:bg-slate-50' : ''} ${isCritical ? 'border-red-200' : 'border-slate-200'}`}
      onClick={onClick}
    >
      <div className={`p-2 rounded-full mt-1 flex-shrink-0 ${isCritical ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
        <AlertTriangle className="w-5 h-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <RiskBadge level={alert.severity} />
            <span className="text-sm font-semibold text-slate-800">{alert.driver?.name || alert.driverId}</span>
          </div>
          <div className="flex items-center text-xs text-slate-400">
            <Clock className="w-3 h-3 mr-1" />
            {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        <p className="text-sm text-slate-600 mb-2 truncate">{alert.description}</p>
        
        <div className="flex items-center text-xs text-slate-500">
          <span>Vehicle: {alert.driver?.vehicleRegistration || alert.vehicleId}</span>
          <span className="mx-2">•</span>
          <span>Score: {alert.riskScore}/100</span>
        </div>
      </div>

      {onClick && (
        <div className="self-center text-slate-400">
          <ChevronRight className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
