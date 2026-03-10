import React, { useEffect, useState } from "react";
import api from "../Services/api";
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar,
  PieChart, Pie, Cell,
} from "recharts";

const COLORS = {
  bg: "#0f172a",
  panel: "#0b1220",
  grid: "#1e293b",
  text: "#cbd5e1",
  axis: "#94a3b8",
  pass: "#10b981",
  fail: "#ef4444",
  bar: "#60a5fa",
  bar2: "#a78bfa",
  pie1: "#22c55e",
  pie2: "#ef4444",
  pie3: "#eab308",
  pie4: "#06b6d4",
  pie5: "#f97316",
};

export default function Charts() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get("/charts");
        if (!mounted) return;
        setData(res.data || {});
      } catch (e) {
        setErr(e?.message || "Failed to load charts data");
      } finally {
        setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-slate-100">Charts</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-slate-800/60 border border-slate-700 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

 if (!data) {
  return (
    <div className="p-6 text-slate-100">
      <h1 className="text-3xl font-bold">Charts</h1>
      <p className="mt-4">Loading charts...</p>
    </div>
  );
}

  const { successOverTime = [], avgTimeByCommand = [], passFail = {}, failByReason = [], execBySuite = [] } = data;

  const passFailPie = [
    { name: "Pass", value: passFail.pass || 0, color: COLORS.pie1 },
    { name: "Fail", value: passFail.fail || 0, color: COLORS.pie2 },
  ];

  return (
    <div className="p-6 text-slate-100 space-y-8">
      <h1 className="text-3xl font-bold">Charts</h1>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1) Success / Fail over time */}
        <div className="rounded-xl bg-slate-800 border border-slate-700 shadow">
          <div className="px-4 py-3 border-b border-slate-700 font-semibold">Success/Fail Over Time</div>
          <div className="p-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={successOverTime}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke={COLORS.axis} />
                <YAxis stroke={COLORS.axis} />
                <Tooltip contentStyle={{ background: COLORS.panel, border: `1px solid ${COLORS.grid}`, color: COLORS.text }} />
                <Legend />
                <Line type="monotone" dataKey="success" stroke={COLORS.pass} strokeWidth={2} dot={false} name="Success" />
                <Line type="monotone" dataKey="fail" stroke={COLORS.fail} strokeWidth={2} dot={false} name="Fail" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2) Avg time by command */}
        <div className="rounded-xl bg-slate-800 border border-slate-700 shadow">
          <div className="px-4 py-3 border-b border-slate-700 font-semibold">Average Time by Command (ms)</div>
          <div className="p-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgTimeByCommand}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="cmd" stroke={COLORS.axis} />
                <YAxis stroke={COLORS.axis} />
                <Tooltip contentStyle={{ background: COLORS.panel, border: `1px solid ${COLORS.grid}`, color: COLORS.text }} />
                <Bar dataKey="ms" name="Average (ms)" fill={COLORS.bar} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3) Pass / Fail pie */}
        <div className="rounded-xl bg-slate-800 border border-slate-700 shadow">
          <div className="px-4 py-3 border-b border-slate-700 font-semibold">Pass / Fail</div>
          <div className="p-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={passFailPie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {passFailPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: COLORS.panel, border: `1px solid ${COLORS.grid}`, color: COLORS.text }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4) Fail by reason (horizontal bars) */}
        <div className="rounded-xl bg-slate-800 border border-slate-700 shadow">
          <div className="px-4 py-3 border-b border-slate-700 font-semibold">Failures by Reason</div>
          <div className="p-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={failByReason} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis type="number" stroke={COLORS.axis} />
                <YAxis type="category" dataKey="reason" stroke={COLORS.axis} width={100} />
                <Tooltip contentStyle={{ background: COLORS.panel, border: `1px solid ${COLORS.grid}`, color: COLORS.text }} />
                <Bar dataKey="count" fill={COLORS.bar2} radius={[6, 6, 6, 6]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5) Executions per suite */}
        <div className="rounded-xl bg-slate-800 border border-slate-700 shadow lg:col-span-2">
          <div className="px-4 py-3 border-b border-slate-700 font-semibold">Executions by Test Suite</div>
          <div className="p-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={execBySuite}>
                <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                <XAxis dataKey="suite" stroke={COLORS.axis} />
                <YAxis stroke={COLORS.axis} />
                <Tooltip contentStyle={{ background: COLORS.panel, border: `1px solid ${COLORS.grid}`, color: COLORS.text }} />
                <Bar dataKey="runs" fill={COLORS.bar} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}