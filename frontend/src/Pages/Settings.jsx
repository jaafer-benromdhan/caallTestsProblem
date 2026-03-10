import React from "react";
import {
  WrenchScrewdriverIcon,
  CpuChipIcon,
  Cog6ToothIcon,
  LinkIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

export default function Settings() {
  return (
    <div className="p-6 text-slate-100 space-y-10">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <div className="flex flex-col gap-4">
      {/* GENERAL */}
      <section className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Cog6ToothIcon className="w-6 h-6 text-slate-300" />
          <h2 className="text-xl font-semibold">General</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-slate-400">Application Theme</label>
            <select className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200">
              <option>Dark (default)</option>
              <option disabled>Light (coming soon)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400">Language</label>
            <select className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200">
              <option>English</option>
              <option>Français</option>
            </select>
          </div>
        </div>
      </section>

      {/* CUBEPROGRAMMER SETTINGS */}
      <section className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <CpuChipIcon className="w-6 h-6 text-slate-300" />
          <h2 className="text-xl font-semibold">CubeProgrammer</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-slate-400">CLI Version (Static)</label>
            <input
              type="text"
              value="v2.22.0"
              readOnly
              className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-300"
            />
          </div>

          <div>
            <label className="text-slate-400">CubeProgrammer Path</label>
            <input
              type="text"
              defaultValue="C:/Program Files/STMicroelectronics/STM32Cube/STM32CubeProgrammer"
              className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-300"
            />
          </div>

          <div>
            <label className="text-slate-400">Log Output Folder</label>
            <input
              type="text"
              defaultValue="C:/logs/cubeprog"
              className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-300"
            />
          </div>
        </div>
      </section>

      {/* INTERFACE SETTINGS */}
      <section className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <LinkIcon className="w-6 h-6 text-slate-300" />
          <h2 className="text-xl font-semibold">Interface</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-slate-400">Target Interface</label>
            <select className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200">
              <option>ST-LINK</option>
              <option>J-LINK</option>
              <option disabled>UART (soon)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400">Connection Mode</label>
            <select className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200">
              <option>Normal</option>
              <option>Hot Plug</option>
              <option>Under Reset</option>
            </select>
          </div>
        </div>
      </section>

      {/* APPLICATION SETTINGS */}
      <section className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <WrenchScrewdriverIcon className="w-6 h-6 text-slate-300" />
          <h2 className="text-xl font-semibold">Application</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-slate-400">Auto-refresh delay (ms)</label>
            <input
              type="number"
              defaultValue={1000}
              className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-300"
            />
          </div>

          <div>
            <label className="text-slate-400">Reset Dashboard</label>
            <button className="mt-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow flex items-center gap-2">
              <ArrowPathIcon className="w-5 h-5" />
              Restore Defaults
            </button>
          </div>
        </div>
        
      </section>
    </div>
    </div>
    
  );
}