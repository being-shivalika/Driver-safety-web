import React, { useState, useEffect } from 'react';

export const ConnectionStatus = () => {
  const [lastSync, setLastSync] = useState(0);

  // Simulate sync updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSync(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatus = () => {
    if (lastSync < 30) return { dot: 'bg-green-500', text: 'Live' };
    if (lastSync < 120) return { dot: 'bg-yellow-500', text: 'Delayed' };
    return { dot: 'bg-gray-400', text: 'Offline' };
  };

  const status = getStatus();

  return (
    <div className="flex flex-col items-end text-xs text-slate-500">
      <div className="flex items-center space-x-2">
        <span className={`w-2 h-2 rounded-full ${status.dot}`}></span>
        <span className="font-medium">{status.text}</span>
      </div>
      <span className="mt-1">Last sync: {lastSync} sec ago</span>
    </div>
  );
};
