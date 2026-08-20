import React from 'react';

export const StatCard = ({ title, value, subtitle, type = 'default', icon }) => {
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
    <div className={`rounded-xl border p-4 shadow-sm flex items-center justify-between ${colors}`}>
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</h3>
        <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {icon && (
        <div className={`p-2 rounded-lg opacity-80 ${colors.replace('bg-', 'bg-').replace('50', '200')}`}>
          {icon}
        </div>
      )}
    </div>
  );
};
