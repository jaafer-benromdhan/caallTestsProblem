import React, { useEffect, useState } from "react";
import api from "../Services/api";
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon
} from "@heroicons/react/24/solid";

import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";

const COLORS = {
  pass: "#10b981",
  fail: "#ef4444"
};

export default function Reports() {
  const [report, setReport] = useState(null);
   const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/reports/latest"),
      api.get("/charts")
    ])
    .then(([rep, ch]) => {
      setReport(rep.data);
       setCharts(ch.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p className="p-6 text-slate-300">Loading report...</p>;
  }

  const statusIcon = (status) => {
    if (status === "SUCCESS") return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
    if (status === "FAIL") return <XCircleIcon className="w-5 h-5 text-red-400" />;
    return <InformationCircleIcon className="w-5 h-5 text-blue-400" />;
  };

  return (
    <div className="p-6 text-slate-100 space-y-8">
      <h1 className="text-3xl font-bold">Test Report</h1>

      {/* SUMMARY */}
      <div className="p-5 bg-slate-800 border border-slate-700 rounded-xl shadow space-y-2">
        <p><span className="text-slate-400">Generated:</span> {report.generatedAt}</p>
        <p><span className="text-slate-400">CubeProgrammer:</span> {report.cubeVersion}</p>
        <p><span className="text-slate-400">Interface:</span> {report.interface}</p>

        <div className="grid grid-cols-3 mt-4 gap-4">
          <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg">Total: {report.summary.totalTests}</div>
          <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg">Success: {report.summary.success}</div>
          <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg">Fail: {report.summary.fail}</div>
        </div>
      </div>

      {/* TEST RESULTS */}
      <div className="p-5 bg-slate-800 border border-slate-700 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">Test Results</h2>

        <div className="space-y-3">
          {report.tests.map((t, i) => (
            <div key={i} className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-700">
              <div className="flex items-center gap-2">
                {statusIcon(t.status)}
                <span className="font-medium">{t.name}</span>
              </div>
              <span className="text-slate-400">{t.time} ms</span>
            </div>
          ))}
        </div>
      </div>

      {/* ONE SINGLE CHART */}
      <div className="p-5 bg-slate-800 border border-slate-700 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold">Success/Fail Over Time</h2>

        <div className="h-80 bg-slate-900 border border-slate-700 rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={charts.successOverTime}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Legend />
              <Line dataKey="success" stroke={COLORS.pass} dot={false} name="Success" />
              <Line dataKey="fail" stroke={COLORS.fail} dot={false} name="Fail" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* LOGS */}
      <div className="p-5 bg-slate-800 border border-slate-700 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">Logs</h2>
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 max-h-72 overflow-y-auto">
          {report.logs.map((line, idx) => (
            <pre key={idx} className="text-slate-300">{line}</pre>
          ))}
        </div>
      </div>
    </div>
  );
}