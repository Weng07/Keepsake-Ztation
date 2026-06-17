"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, CheckCircle, XCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface UploadedFile {
  name: string;
  url: string;
  status: "uploading" | "done" | "error";
}

export default function ImageUploader() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback(async (accepted: File[]) => {
    for (const file of accepted) {
      const entry: UploadedFile = { name: file.name, url: "", status: "uploading" };
      setFiles((prev) => [...prev, entry]);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Upload failed");
        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name ? { ...f, url: json.url, status: "done" } : f
          )
        );
        toast.success(`${file.name} uploaded!`);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Upload error";
        setFiles((prev) =>
          prev.map((f) => (f.name === file.name ? { ...f, status: "error" } : f))
        );
        toast.error(message);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"] },
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-none p-10 text-center cursor-pointer transition-colors duration-200",
          isDragActive ? "border-gold bg-gold/5" : "border-stone/30 hover:border-gold/50"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-3 text-faint" size={28} />
        <p className="text-sm text-muted">
          {isDragActive ? "Drop images here…" : "Drag & drop images, or click to select"}
        </p>
        <p className="text-xs text-faint mt-1">JPG, PNG, WebP — up to 10 MB each</p>
      </div>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between bg-ivory px-4 py-3 text-sm">
              <span className="text-ink truncate max-w-xs">{f.name}</span>
              <span>
                {f.status === "uploading" && <Loader2 size={16} className="animate-spin text-gold" />}
                {f.status === "done" && <CheckCircle size={16} className="text-sage" />}
                {f.status === "error" && <XCircle size={16} className="text-rust" />}
              </span>
            </li>
          ))}
        </ul>
      )}

      {files.some((f) => f.status === "done") && (
        <div className="bg-mist p-4 text-xs text-muted space-y-1">
          <p className="section-label mb-2">Uploaded paths — copy into your content files:</p>
          {files.filter((f) => f.status === "done").map((f, i) => (
            <p key={i} className="font-mono text-ink select-all">{f.url}</p>
          ))}
        </div>
      )}
    </div>
  );
}
