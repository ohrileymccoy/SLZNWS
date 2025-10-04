// src/App.jsx
import { BrowserRouter } from "react-router-dom";
import TOSModal from "./components/TOSModal";
import AppShell from "./main.jsx"; // 👈 import the real app from main.jsx

/**
 * Unified App entry.
 * - Provides a single BrowserRouter wrapper.
 * - Always full-screen, responsive, and self-contained.
 * - Mounts global modals (e.g., TOSModal).
 */
export default function App() {
  return (
    <div className="w-full min-h-screen bg-neutral-950 text-neutral-100 overflow-x-hidden">
      <BrowserRouter>
        <TOSModal />
        <AppShell />
      </BrowserRouter>
    </div>
  );
}
