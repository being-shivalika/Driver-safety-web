import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export const DashboardLayout = () => {
  return (
    <div className="flex h-screen w-full bg-fleet-light overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-auto p-2 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
