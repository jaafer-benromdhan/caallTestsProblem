import React from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

export default function Logs() {
  // 🔥 LOGS STATIQUES (exemples) — aucun backend nécessaire
  const STATIC_LOGS = [
    {
      timestamp: "11:39:11:708",
      level: "INFO",
      message: "STM32CubeProgrammer v2.22.0-A05 started",
      suite: "BoardInfo",
    },
    {
      timestamp: "11:39:11:743",
      level: "INFO",
      message: "ST-LINK SN : 0668FF363730554157104735",
      suite: "BoardInfo",
    },
    {
      timestamp: "11:39:11:826",
      level: "INFO",
      message: "Device CPU : Cortex-M4",
      suite: "BoardInfo",
    },
    {
      timestamp: "11:39:11:840",
      level: "ERROR",
      message: "Connection timeout while reading flash",
      suite: "C031",
    },
    {
      timestamp: "11:39:12:015",
      level: "SUCCESS",
      message: "WRITE completed successfully",
      suite: "HS73",
    },
  ];

  const LEVEL = {
    INFO: {
      icon: InformationCircleIcon,
      badge: "bg-blue-900/40 border-blue-700 text-blue-300",
      color: "text-blue-400",
    },
    SUCCESS: {
      icon: CheckCircleIcon,
      badge: "bg-green-900/40 border-green-700 text-green-300",
      color: "text-green-400",
    },
    ERROR: {
      icon: XCircleIcon,
      badge: "bg-red-900/40 border-red-700 text-red-300",
      color: "text-red-400",
    },
    WARNING: {
      icon: ExclamationCircleIcon,
      badge: "bg-yellow-900/40 border-yellow-700 text-yellow-300",
      color: "text-yellow-400",
    },
  };

  return (
    <div className="p-6 text-slate-100 space-y-6">
      <h1 className="text-3xl font-bold">Logs</h1>

      <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-2">
        {STATIC_LOGS.map((log, index) => {
          const L = LEVEL[log.level];
          const Icon = L.icon;

          return (
            <div
              key={index}
              className="p-4 bg-slate-800 border border-slate-700 rounded-lg shadow flex items-start gap-3"
            >
              <Icon className={`w-6 h-6 mt-1 ${L.color}`} />

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded border ${L.badge}`}
                  >
                    {log.level}
                  </span>

                  <span className="text-xs text-slate-400">
                    {log.timestamp}
                  </span>
                </div>

                <p className="mt-1">{log.message}</p>

                {log.suite && (
                  <span className="text-xs text-slate-500 mt-1">
                    Suite: {log.suite}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
