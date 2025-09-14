// src/pages/SecureAdmin.jsx
import { useState } from "react";
import AdminPage from "./AdminPage.jsx";

export default function SecureAdmin() {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    // Try hitting the protected API with this token
    const res = await fetch("/api/v1/admin_protected", {
      headers: { Authorization: `Bearer ${input}` },
    });

    if (res.ok) {
      localStorage.setItem("adminToken", input);
      setToken(input);
      setError("");
    } else {
      setError("Invalid passphrase");
    }
  }

  // 🔒 If no token, show prompt
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-lg bg-neutral-800 w-80"
        >
          <h2 className="text-lg font-semibold mb-3">Admin Access</h2>
          <input
            type="password"
            placeholder="Enter passphrase"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-3 py-2 rounded bg-neutral-900 text-white border border-neutral-700 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="mt-3 w-full px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 active:scale-95 transition"
          >
            Unlock
          </button>
          {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
        </form>
      </div>
    );
  }

  // ✅ If unlocked, render your real admin UI
  return <AdminPage />;
}
