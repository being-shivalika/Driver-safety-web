import React from 'react';

export const RiskBadge = ({ level }) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';
  
  switch (level?.toUpperCase()) {
    case 'LOW':
      bgColor = 'bg-risk-low/20';
      textColor = 'text-risk-low';
      break;
    case 'MODERATE':
      bgColor = 'bg-risk-moderate/20';
      textColor = 'text-yellow-700'; // Darker for better contrast
      break;
    case 'HIGH':
      bgColor = 'bg-risk-high/20';
      textColor = 'text-risk-high';
      break;
    case 'CRITICAL':
      bgColor = 'bg-risk-critical/20';
      textColor = 'text-risk-critical';
      break;
    default:
      break;
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${bgColor} ${textColor}`}>
      {level || 'UNKNOWN'}
    </span>
  );
};
