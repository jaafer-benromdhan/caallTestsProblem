import React, { useEffect, useMemo, useState } from "react";
import api from "../Services/api";
import Sidebar from "../components/Sidebar/Sidebar";
import BoardSection from "../components/BoardSection";
import { Bars3Icon } from "@heroicons/react/24/solid";

export default function TestsPage() {
  const [boards, setBoards] = useState({});
  const [selectedBoard, setSelectedBoard] = useState("ALL");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // -------------------------------
  // 📌 GET TEST SUITES (avec console log)
  // -------------------------------
  useEffect(() => {
    api.get("/testsuites").then(res => {
      setBoards(res.data || {});
      console.log("📌 Tests reçus depuis backend :", res.data);  // AJOUT
    });
  }, []);

  // -------------------------------
  // 📌 RUN TEST (boardKey + line_id)
  // -------------------------------
  async function runTest(boardKey, line_id) {
    try {
      const response = await api.post("/run_test", { boardKey, line_id });
      console.log("Résultat :", response.data);
    } catch (err) {
      console.error("Erreur dans runTest:", err);
    }
  }

  const runAllInBoard = () => {
    const list =
      selectedBoard === "ALL"
        ? Object.values(boards).flat()
        : boards[selectedBoard] || [];
    if (!list.length) return;

    list.forEach(t => api.post("/run_test", t));
  };

  const filteredBoardKeys = useMemo(() => {
    const keys = Object.keys(boards);
    if (!search.trim()) return ["ALL", ...keys];
    const q = search.toLowerCase();
    const filtered = keys.filter(k => k.toLowerCase().includes(q));
    return ["ALL", ...filtered];
  }, [boards, search]);

  const visibleBoards = useMemo(() => {
    if (selectedBoard === "ALL") {
      return filteredBoardKeys.filter(k => k !== "ALL");
    }
    return filteredBoardKeys.includes(selectedBoard) ? [selectedBoard] : [];
  }, [filteredBoardKeys, selectedBoard]);

  return (
    <div className="min-h-screen bg-slate-900 flex">

      <div className="flex-1 min-w-0 ">
        <div className="sticky top-0 z-20 border-b px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Bars3Icon className="w-6 h-6 text-gray-700" />
          </button>

          <div className="flex-1 flex items-center justify-between ">
            <h1 className="text-2xl sm:text-3xl text-white font-bold tracking-tight">
              Configured Tests
            </h1>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {visibleBoards.length === 0 && (
            <div className="text-gray-500">Aucun board à afficher.</div>
          )}

          {visibleBoards.map((boardName) => (
            <BoardSection
              key={boardName}
              name={boardName}
              tests={boards[boardName] || []}
              onRun={runTest}
            />
          ))}

          <div className="sm:hidden sticky bottom-4 flex justify-end pr-2">
            <button
              onClick={runAllInBoard}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-full shadow"
            >
              Run All {selectedBoard !== "ALL" ? `(${selectedBoard})` : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}