import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  Users,
  History,
  ShieldAlert,
} from "lucide-react";

export const Sidebar = () => {
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Live Fleet", path: "/fleet", icon: Map },
    { name: "Drivers", path: "/drivers", icon: Users },
    { name: "Trip History", path: "/trips", icon: History },
  ];

  return (
    <aside className="w-56 bg-fleet-navy text-slate-300 flex flex-col h-full border-r border-slate-800">
      <div className="p-4 flex items-center space-x-3 text-white">
        <img src="/logo.png" alt="VigilDrive Logo" className="w-8 h-8" />
        <span className="text-xl font-bold tracking-wide">VIGILDRIVE</span>
      </div>

      <nav className="flex-1 mt-6 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                    isActive
                      ? "bg-fleet-accent/10 text-fleet-accent border-l-2 border-fleet-accent"
                      : "hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 text-xs text-slate-500 border-t border-slate-800">
        &copy; 2026 VigilDrive SIH
      </div>
    </aside>
  );
};
