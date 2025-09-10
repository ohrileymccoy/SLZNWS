import { useState } from "react";
import { Link } from "react-router-dom";

export default function UploadMugshot() {
  const [name, setName] = useState("");
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

      <div>
        <label className="block text-sm text-neutral-400 mb-1">
          Name / Label
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 p-2 text-sm"
          placeholder="John Doe"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-400 mb-1">
          Photo File
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full text-sm"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 hover:border-neutral-600 transition text-sm"
      >
        {loading ? "Uploading…" : "Upload"}
      </button>

      {message && <p className="text-sm mt-2">{message}</p>}
      <Link
  to="/mugshot"
  className="inline-block mt-4 text-sm text-neutral-400 hover:text-neutral-200 underline"
>
  Go to Moderation Panel
</Link>
    </form>
  );
}
