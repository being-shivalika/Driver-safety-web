import React from 'react';
import { useLocation } from 'react-router-dom';
import { ConnectionStatus } from '../ui/ConnectionStatus';
import { useAuth } from '../../context/AuthContext';
import { UserCircle } from 'lucide-react';

export const Topbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/dashboard': return 'Fleet Overview';
      case '/fleet': return 'Live Fleet';
      case '/drivers': return 'Drivers Safety';
      case '/alerts': return 'Safety Alerts';
      case '/trips': return 'Trip History';
      default: return 'VigilDrive Dashboard';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10 relative">
      <h1 className="text-xl font-semibold text-slate-800">{getPageTitle()}</h1>
      
      <div className="flex items-center space-x-8">
        <ConnectionStatus />
        
        <div className="flex items-center space-x-3 pl-6 border-l border-slate-200">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-800">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
          <UserCircle className="w-8 h-8 text-slate-400" />
        </div>
      </div>
    </header>
  );
};
