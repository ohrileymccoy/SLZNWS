import { useRef, useState } from "react";
import { SECTION_ORDER, SECTION_LABELS } from "../constants/sections";

export default function UploadPhoto() {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");           // renamed caption → text
  const [section, setSection] = useState("news");
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null); // { ok, msg, urls }

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

  function onFileChange(e) {
    const f = Array.from(e.target.files || []);
    setFiles(f);
    setStatus(null);
    if (f.length && !title) {
      const base = f[0].name.replace(/\.[^.]+$/, "");
      setTitle(base);
    }
  }

  async function onUploadClick() {
    if (!files.length) {
      setStatus({ ok: false, msg: "Pick one or more images first." });
      return;
    }

    const safeTitle = title?.trim() || files[0].name.replace(/\.[^.]+$/, "");
    const slug = slugify(safeTitle);

    setUploading(true);
    setStatus(null);

    try {
      const form = new FormData();
      files.forEach((f) => form.append("files", f));
      form.append("title", safeTitle);
      form.append("slug", slug);
      form.append("caption", text);   // backend still expects "caption"
      form.append("section", section);

      const res = await fetch("/api/v1/photos/upload_photos", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error("Upload failed");

      const json = await res.json();
      setStatus({ ok: true, msg: "Uploaded!", urls: json.keys });

      // Reset state
      setFiles([]);
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
      <h2 className="text-lg font-semibold mb-4">Upload Photos</h2>

      {/* Title */}
      <label className="block text-xs text-neutral-400 mb-1">Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My photo set title"
        className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600 mb-4"
      />

      {/* Text (renamed from caption) */}
      <label className="block text-xs text-neutral-400 mb-1">Text</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write something…"
        rows={4}
        className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-neutral-600 mb-4 resize-y"
      />

    {/* Section */}
<label className="block text-xs text-neutral-400 mb-1">Section</label>
<select
  value={section}
  onChange={(e) => setSection(e.target.value)}
  className="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none 
             focus:border-neutral-600 mb-4"
>
  {SECTION_ORDER.map((key) => (
    <option key={key} value={key}>
      {SECTION_LABELS[key]}
    </option>
  ))}
</select>


      {/* File input + buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
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
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 hover:border-neutral-600"
        >
          Select files
        </button>
        <button
          type="button"
          onClick={onUploadClick}
          disabled={!files.length || uploading}
          className={`px-4 py-2 rounded-xl border ${
            !files.length || uploading
              ? "bg-neutral-900 border-neutral-800 text-neutral-500 cursor-not-allowed"
              : "bg-neutral-100 text-neutral-900 border-neutral-200 hover:bg-white"
          }`}
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul className="mt-3 text-xs text-neutral-400 space-y-1 max-h-32 overflow-y-auto">
          {files.map((f, i) => (
            <li key={i}>
              {f.name} ({Math.round(f.size / 1024)} KB)
            </li>
          ))}
        </ul>
      )}

      {/* Status */}
      {status && (
        <div
          className={`mt-3 text-sm ${
            status.ok ? "text-green-400" : "text-red-400"
          }`}
        >
          {status.msg}
          {status.ok && status.urls && (
            <ul className="mt-2 space-y-1">
              {status.urls.map((u, i) => (
                <li key={i}>
                  <a
                    href={u}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    Open photo {i + 1}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
