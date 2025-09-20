import { useRef, useState } from "react";

export default function UploadVideo({ simple = false }) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");           // renamed caption → text
  const [section, setSection] = useState("news");
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

    const safeTitle = title?.trim() || file.name.replace(/\.[^.]+$/, "");
    const slug = slugify(safeTitle) || slugify(file.name.replace(/\.[^.]+$/, ""));

    setUploading(true);
    setStatus(null);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("title", safeTitle);
      form.append("slug", slug);
      form.append("caption", text);   // backend still expects "caption"
      form.append("section", section);

      const res = await fetch("/api/v1/upload_url", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
  },
  body: form,
});
if (res.status === 401) {
  setStatus({ ok: false, msg: "Session expired. Please re-enter admin password." });
  // Optionally redirect:
  // window.location.href = "/admin-login";
  return;
}
      if (!res.ok) throw new Error("Upload failed");

      const json = await res.json();

      setStatus({ ok: true, msg: "Uploaded!", url: json.public_url });

      // reset
      setFile(null);
      setTitle("");
      setText("");
      setSection("news");
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
      <label className="block text-xs text-neutral-400 mb-1">
        Title (optional)
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My clip title"
        className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600 mb-4"
      />

      {/* Text (renamed from caption) */}
      {!simple && (
        <>
          <label className="block text-xs text-neutral-400 mb-1">
            Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write something…"
            rows={4}
            className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600 mb-4 resize-y"
          />
        </>
      )}

      {/* Section */}
      {!simple && (
        <>
          <label className="block text-xs text-neutral-400 mb-1">Section</label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600 mb-4"
          >
            <option value="news">News</option>
            <option value="culture">Culture</option>
            <option value="sports">Sports</option>
            <option value="featured">Featured</option>
          </select>
        </>
      )}

      {/* File + buttons */}
      <div className="flex flex-wrap items-center gap-3">
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
        <button
          type="button"
          onClick={onSelectClick}
          disabled={uploading}
          className="px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 hover:border-neutral-600"
        >
          Select file
        </button>
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
        <span className="text-xs text-neutral-400 truncate">
          {file
            ? `${file.name} (${Math.round(file.size / 1024)} KB)`
            : "No file selected"}
        </span>
      </div>

      {/* Status */}
      {status && (
        <div
          className={`mt-3 text-sm ${
            status.ok ? "text-green-400" : "text-red-400"
          }`}
        >
          {status.msg}
          {status.ok && status.url && (
            <>
              {" — "}
              <a
                className="underline"
                href={status.url}
                target="_blank"
                rel="noreferrer"
              >
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
