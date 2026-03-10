import React from "react";
import {
  HomeIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Squares2X2Icon } from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";

export default function Sidebar({ open, onClose }) {
  const navItems = [
    { to: "/", label: "Overview", Icon: HomeIcon, end: true },
    { to: "/tests", label: "Tests", Icon: WrenchScrewdriverIcon },
    { to: "/charts", label: "Charts", Icon: ChartBarIcon },
    { to: "/logs", label: "Logs", Icon: DocumentTextIcon },
    { to: "/reports", label: "Reports", Icon: DocumentDuplicateIcon },
    { to: "/settings", label: "Settings", Icon: Cog6ToothIcon },
  ];

  const NavItem = ({ to, label, Icon, end = false, onClick }) => (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 px-4 py-2 rounded-lg transition",
          isActive
            ? "bg-slate-800 text-white"
            : "text-slate-300 hover:bg-slate-800 hover:text-white",
        ].join(" ")
      }
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </NavLink>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 shadow-xl">
        {/* LOGO */}
        <div className="px-5 py-6 flex items-center gap-3 border-b border-slate-800">
          <Squares2X2Icon className="w-7 h-7 text-indigo-400" />
          <h1 className="text-xl font-bold text-white tracking-wide">
            Dashboard
          </h1>
        </div>

        {/* NAVIGATION */}
        <nav className="px-3 py-5 space-y-2">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      <div
        onClick={onClose}
        className={[
          "fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Mobile Sidebar */}
      <aside
        className={[
          "fixed z-50 inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 shadow-xl md:hidden transition-transform",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="px-4 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Squares2X2Icon className="w-6 h-6 text-indigo-400" />
            <h1 className="text-lg font-bold text-white">Dashboard</h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>
        </div>

        <nav className="px-3 py-5 space-y-2">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} onClick={onClose} />
          ))}
        </nav>
      </aside>
    </>
  );
}