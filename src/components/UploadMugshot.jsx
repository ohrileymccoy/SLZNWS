import { useState } from "react";
import { Link } from "react-router-dom";

export default function UploadMugshot() {
  const [name, setName] = useState("");
  const [stats, setStats] = useState("");
  const [charges, setCharges] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setMessage("Please choose a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("stats", stats);
    formData.append("charges", charges);

    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch("/api/v1/mugshots/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.ok) {
        setMessage("✅ Mugshot uploaded successfully");
        setName("");
        setStats("");
        setCharges("");
        setFile(null);
      } else {
        setMessage("❌ Upload failed: " + (json.error || "Unknown error"));
      }
    } catch (err) {
      setMessage("❌ Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6"
    >
      <h3 className="text-lg font-semibold">Upload Mugshot</h3>

      {/* Name bubble */}
      <div>
        <label className="block text-xs text-neutral-400 mb-1">
          Name / Label
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm outline-none focus:border-neutral-600"
          placeholder="John Doe"
          required
        />
      </div>

      {/* Height / Weight */}
      <div>
        <label className="block text-xs text-neutral-400 mb-1">
          Height / Weight
        </label>
        <input
          type="text"
          value={stats}
          onChange={(e) => setStats(e.target.value)}
          className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm outline-none focus:border-neutral-600"
          placeholder={`e.g. "5'10 / 160 lbs"`}
        />
      </div>

      {/* Charges */}
      <div>
        <label className="block text-xs text-neutral-400 mb-1">Charges</label>
        <textarea
          value={charges}
          onChange={(e) => setCharges(e.target.value)}
          className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm outline-none focus:border-neutral-600"
          placeholder="Disorderly conduct, resisting arrest..."
          rows={2}
        />
      </div>

      {/* File bubble */}
      <div>
        <label className="block text-xs text-neutral-400 mb-1">Photo File</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-neutral-300 file:mr-4 file:rounded-lg file:border-0 file:bg-neutral-800 file:px-3 file:py-2 file:text-sm file:text-neutral-200 hover:file:bg-neutral-700"
          required
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 hover:border-neutral-600 text-sm font-medium text-neutral-200 transition disabled:opacity-50"
      >
        {loading ? "Uploading…" : "Upload Mugshot"}
      </button>

      {/* Status */}
      {message && <p className="text-sm mt-2">{message}</p>}

      {/* Navigation bubble */}
      <Link
        to="/mugshot"
        className="inline-block mt-4 px-3 py-1.5 rounded-lg bg-neutral-800/60 border border-neutral-700 hover:border-neutral-600 text-xs text-neutral-300 transition"
      >
        Go to Moderation Panel
      </Link>
    </form>
  );
}
