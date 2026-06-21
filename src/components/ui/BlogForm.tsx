"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { Upload, X, Loader2, ImagePlus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types";

interface Props {
  initial?: Partial<BlogPost>;
  mode: "create" | "edit";
  slug?: string;
}

export default function BlogForm({ initial, mode, slug }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    author: initial?.author ?? "",
    tags: Array.isArray(initial?.tags) ? initial.tags.join(", ") : "",
    coverImage: initial?.coverImage ?? "",
    published: initial?.published ?? false,
  });

  const set = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Image drop handler — uploads immediately and fills coverImage, same
  // pattern as ProductForm so the whole site only has one upload path.
  const onDrop = useCallback(async (accepted: File[]) => {
    const file = accepted[0];
    if (!file) return;
    setUploadingImage(true);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");

      setForm((prev) => ({ ...prev, coverImage: json.url }));
      toast.success("Image uploaded!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingImage(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const handleSubmit = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.excerpt.trim()) { toast.error("Excerpt is required"); return; }
    if (!form.content.trim()) { toast.error("Post content is required"); return; }

    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      const url = mode === "edit" ? `/api/blog/${slug}` : "/api/blog";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");

      toast.success(mode === "edit" ? "Post updated!" : "Post created!");
      router.push("/admin/blog");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Cover Image */}
      <section>
        <h2 className="font-display text-2xl text-ink mb-5">Cover Image</h2>

        {form.coverImage ? (
          <div className="relative group aspect-video max-w-md mb-3 bg-mist overflow-hidden">
            <Image
              src={form.coverImage}
              alt="Cover"
              fill
              className="object-cover"
              sizes="448px"
            />
            <button
              onClick={() => set("coverImage", "")}
              title="Remove"
              className="absolute top-2 right-2 bg-rust text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200 max-w-md",
              isDragActive ? "border-gold bg-gold/5" : "border-stone/30 hover:border-gold/60"
            )}
          >
            <input {...getInputProps()} />
            {uploadingImage ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={28} className="animate-spin text-gold" />
                <p className="text-sm text-muted">Uploading…</p>
              </div>
            ) : (
              <>
                <ImagePlus size={28} className="mx-auto mb-3 text-faint" />
                <p className="text-sm text-muted">
                  {isDragActive ? "Drop to upload" : "Drag & drop, or click to select"}
                </p>
                <p className="text-xs text-faint mt-1">JPG, PNG, WebP — max 10 MB</p>
              </>
            )}
          </div>
        )}
      </section>

      {/* Post Details */}
      <section>
        <h2 className="font-display text-2xl text-ink mb-5">Post Details</h2>
        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className="block text-xs tracking-widest uppercase text-muted mb-2">
              Title <span className="text-rust">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Welcome to the Studio"
              className="w-full bg-ivory border border-stone/20 px-4 py-3 text-ink text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-muted mb-2">
              Excerpt <span className="text-rust">*</span>{" "}
              <span className="text-faint">(one sentence, shown in post cards)</span>
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="A short summary that hooks the reader."
              rows={2}
              className="w-full bg-ivory border border-stone/20 px-4 py-3 text-ink text-sm focus:outline-none focus:border-gold transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs tracking-widest uppercase text-muted mb-2">
                Author
              </label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => set("author", e.target.value)}
                placeholder="Your Name"
                className="w-full bg-ivory border border-stone/20 px-4 py-3 text-ink text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-muted mb-2">
                Tags <span className="text-faint">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="design, process, studio"
                className="w-full bg-ivory border border-stone/20 px-4 py-3 text-ink text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-muted mb-2">
              Post Content <span className="text-rust">*</span>{" "}
              <span className="text-faint">(Markdown supported — headings, bold, links, lists)</span>
            </label>
            <textarea
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              placeholder={"## A heading\n\nWrite your post here. **Bold**, _italic_, and [links](https://example.com) all work."}
              rows={14}
              className="w-full bg-ivory border border-stone/20 px-4 py-3 text-ink text-sm focus:outline-none focus:border-gold transition-colors resize-y font-mono leading-relaxed"
            />
          </div>
        </div>
      </section>

      {/* Publish toggle */}
      <section>
        <h2 className="font-display text-2xl text-ink mb-5">Visibility</h2>
        <label className="flex items-start gap-4 cursor-pointer group">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              className="sr-only"
              checked={form.published}
              onChange={(e) => set("published", e.target.checked)}
            />
            <div
              className={cn(
                "w-5 h-5 border-2 flex items-center justify-center transition-colors",
                form.published ? "bg-gold border-gold" : "border-stone/40 group-hover:border-gold"
              )}
            >
              {form.published && <Check size={12} className="text-ink" />}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-ink">Published</p>
            <p className="text-xs text-muted">
              Live on the Journal immediately. Leave unchecked to save as a private draft.
            </p>
          </div>
        </label>
      </section>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-4 border-t border-stone/10">
        <button onClick={handleSubmit} disabled={saving} className="btn-primary">
          {saving ? (
            <><Loader2 size={15} className="animate-spin" /> Saving…</>
          ) : mode === "edit" ? (
            "Save Changes"
          ) : form.published ? (
            "Publish Post"
          ) : (
            "Save Draft"
          )}
        </button>
        <button
          onClick={() => router.back()}
          className="text-xs tracking-widest uppercase text-muted hover:text-ink transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
