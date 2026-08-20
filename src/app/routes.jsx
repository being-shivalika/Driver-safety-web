import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { LiveFleetPage } from '../pages/LiveFleetPage';
import { DriversPage } from '../pages/DriversPage';
import { TripHistoryPage } from '../pages/TripHistoryPage';

import { ProtectedRoute } from '../components/layout/ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<ProtectedRoute requiredRoles={['Fleet Manager', 'Safety Supervisor', 'System Administrator']}><DashboardPage /></ProtectedRoute>} />
        <Route path="fleet" element={<ProtectedRoute requiredRoles={['Fleet Manager', 'Safety Supervisor', 'System Administrator']}><LiveFleetPage /></ProtectedRoute>} />
        <Route path="drivers" element={<ProtectedRoute requiredRoles={['Fleet Manager', 'Safety Supervisor', 'System Administrator']}><DriversPage /></ProtectedRoute>} />
        <Route path="trips" element={<ProtectedRoute requiredRoles={['Fleet Manager', 'Safety Supervisor', 'System Administrator']}><TripHistoryPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};
