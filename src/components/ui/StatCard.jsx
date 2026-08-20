import React from 'react';

export const StatCard = ({ title, value, subtitle, type = 'default' }) => {
  let colors = 'bg-white border-slate-200';
  let valueColor = 'text-slate-800';

  if (type === 'high') {
    colors = 'bg-orange-50 border-orange-200';
    valueColor = 'text-orange-700';
  } else if (type === 'critical') {
    colors = 'bg-red-50 border-red-200';
    valueColor = 'text-red-700';
  } else if (type === 'moderate') {
    colors = 'bg-yellow-50 border-yellow-200';
    valueColor = 'text-yellow-700';
  } else if (type === 'low') {
    colors = 'bg-green-50 border-green-200';
    valueColor = 'text-green-700';
  } else if (type === 'primary') {
    colors = 'bg-sky-50 border-sky-200';
    valueColor = 'text-sky-700';
  }

  return (
    <div className={`rounded-xl border p-5 shadow-sm ${colors}`}>
      <h3 className="text-sm font-medium text-slate-500 mb-1">{title}</h3>
      <div className={`text-3xl font-bold ${valueColor}`}>{value}</div>
      {subtitle && <p className="text-xs text-slate-500 mt-2">{subtitle}</p>}
    </div>
  );
};
