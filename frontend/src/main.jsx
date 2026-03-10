import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";

// Dark mode global
document.documentElement.classList.add("dark");

import App from "./App";
import Overview from  "./Pages/Overview";
import TestsPage from "./Pages/TestsPage";
import Charts from "./Pages/Charts";
 import Logs from "./Pages/Logs";
 import Reports from "./Pages/Reports";
 import Settings from "./pages/Settings";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-900">
        {/* Sidebar is inside App because App wraps all pages */}
        <App>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/tests" element={<TestsPage />} />
            <Route path="/charts" element={<Charts />}/>
            <Route path="/logs" element={<Logs />} />
              <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} /> 
          </Routes>
        </App>
      </div>
    </BrowserRouter>
  </React.StrictMode>
);