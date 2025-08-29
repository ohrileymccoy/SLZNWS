import { useRef, useState } from "react";

export default function UploadVideo() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null); // { ok, msg, url }

  function slugify(s) {
    return (s || "")
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function onSelectClick() {
    fileInputRef.current?.click();
  }

  function onFileChange(e) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setStatus(null);
    if (f && !title) {
      const base = f.name.replace(/\.[^.]+$/, "");
      setTitle(base);
    }
  }

  async function onUploadClick() {
    if (!file) {
      setStatus({ ok: false, msg: "Pick a file first." });
      return;
    }
    const ext = (file.name.split(".").pop() || "").toLowerCase() || "mp4";
    const safeTitle = title?.trim() || file.name.replace(/\.[^.]+$/, "");
    const slug = slugify(safeTitle) || slugify(file.name.replace(/\.[^.]+$/, ""));

    const qs = new URLSearchParams({ title: safeTitle, slug, ext });

    setUploading(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/v1/videos/upload?${qs.toString()}`, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.ok === false) {
        throw new Error(json.error || `Upload failed (${res.status})`);
      }
      setStatus({ ok: true, msg: "Uploaded!", url: json.url || json.public_url });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setStatus({ ok: false, msg: err.message || String(err) });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <h2 className="text-lg font-semibold mb-4">Upload Video</h2>

      {/* Title */}
      <label className="block text-xs text-neutral-400 mb-1">Title (optional)</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My clip title"
        className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600 mb-4"
      />

      {/* Visible file input + Select + Upload buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Visible file input so it never looks like plain text */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={onFileChange}
          className="
            file:mr-3 file:px-3 file:py-2 file:rounded-xl file:border file:border-neutral-700 file:bg-neutral-800
            file:text-neutral-100 file:hover:border-neutral-600 file:cursor-pointer
            text-neutral-300 text-sm
            max-w-xs
          "
        />

        {/* Explicit Select button (duplicates the input’s native button, but obvious) */}
        <button
          type="button"
          onClick={onSelectClick}
          disabled={uploading}
          className="px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 hover:border-neutral-600"
        >
          Select file
        </button>

        {/* Upload button */}
        <button
          type="button"
          onClick={onUploadClick}
          disabled={!file || uploading}
          className={`px-4 py-2 rounded-xl border ${
            !file || uploading
              ? "bg-neutral-900 border-neutral-800 text-neutral-500 cursor-not-allowed"
              : "bg-neutral-100 text-neutral-900 border-neutral-200 hover:bg-white"
          }`}
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>

        {/* Filename */}
        <span className="text-xs text-neutral-400 truncate">
          {file ? `${file.name} (${Math.round(file.size / 1024)} KB)` : "No file selected"}
        </span>
      </div>

      {/* Status */}
      {status && (
        <div className={`mt-3 text-sm ${status.ok ? "text-green-400" : "text-red-400"}`}>
          {status.msg}
          {status.ok && status.url && (
            <>
              {" "}
              —{" "}
              <a className="underline" href={status.url} target="_blank" rel="noreferrer">
                Open
              </a>
            </>
          )}
        </div>
      )}

      <p className="mt-3 text-xs text-neutral-500">
        Tip: We auto-slugify from Title or filename. Works best with H.264/AAC MP4.
      </p>
    </div>
  );
}
