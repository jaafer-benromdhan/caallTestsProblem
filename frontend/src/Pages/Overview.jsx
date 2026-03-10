import React, { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  CpuChipIcon,
  ClockIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";
import api from "../Services/api";

export default function Overview() {
  const [info, setInfo] = useState({
    version: "Loading...",
    connected: false,
    interface: "Unknown",
    lastRuns: [],
    totalTests: 0,
    successRate: 0,
    avgTime: 0,
  });

  useEffect(() => {
    api.get("/overview").then((res) => {
      setInfo(res.data || {});
    });
  }, []);

  return (
    <div className="p-6 text-slate-100 space-y-8">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold">Overview</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Version */}
        <div className="p-5 rounded-xl bg-slate-800 border border-slate-700 shadow">
          <p className="text-sm text-slate-400">CubeProgrammer Version</p>
          <p className="text-2xl font-bold mt-1">{info.version}</p>
        </div>

        {/* Total tests */}
        <div className="p-5 rounded-xl bg-slate-800 border border-slate-700 shadow">
          <p className="text-sm text-slate-400">Total Tests</p>
          <p className="text-2xl font-bold mt-1">{info.totalTests}</p>
        </div>

        {/* Success Rate */}
        <div className="p-5 rounded-xl bg-slate-800 border border-slate-700 shadow">
          <p className="text-sm text-slate-400">Success Rate</p>
          <p className="text-2xl font-bold mt-1">{info.successRate}%</p>
        </div>
      </div>

      {/* SYSTEM STATUS */}
      <div className="p-6 bg-slate-800 border border-slate-700 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">System Status</h2>

        <div className="space-y-2">
          <p><span className="text-slate-400">Interface:</span> {info.interface}</p>
          <p><span className="text-slate-400">Connected:</span> {info.connected ? "Yes" : "No"}</p>
          <p><span className="text-slate-400">CLI Path:</span> {info.path || "Unknown"}</p>
        </div>
      </div>

      {/* LAST RUNS */}
      <div className="p-6 bg-slate-800 border border-slate-700 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Executions</h2>

        {info.lastRuns.length === 0 && (
          <p className="text-slate-400">No executions yet.</p>
        )}

        <div className="space-y-2">
          {info.lastRuns.map((run, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3 bg-slate-900 rounded-lg border border-slate-700"
            >
              <div className="flex items-center gap-3">
                {run.success ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-red-400" />
                )}
                <span className="font-medium">{run.name}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  {run.time} ms
                </div>
                <div>{run.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}