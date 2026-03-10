import React, { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import { Bars3Icon } from "@heroicons/react/24/solid";

export default function App({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex w-full min-h-screen bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* MAIN AREA */}
      <div className="flex-1 min-w-0">

        {/* Topbar */}
        <div className="sticky top-0 z-20 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded hover:bg-slate-800"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="w-6 h-6 text-slate-200" />
          </button>

          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        </div>

        {/* Page content */}
        <div className="p-4 sm:p-6">
          {children}
        </div>

      </div>
    </div>
  );
}