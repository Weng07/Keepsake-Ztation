"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { Upload, X, Loader2, ImagePlus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product, ProductCategory } from "@/types";

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "souvenir", label: "Souvenir" },
  { value: "print", label: "Art Print" },
  { value: "digital", label: "Digital Download" },
  { value: "sticker", label: "Sticker" },
  { value: "poster", label: "Poster" },
  { value: "apparel", label: "Apparel" },
  { value: "accessory", label: "Accessory" },
  { value: "other", label: "Other" },
];

interface Props {
  initial?: Partial<Product>;
  mode: "create" | "edit";
  slug?: string;
}

export default function ProductForm({ initial, mode, slug }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    longDescription: initial?.longDescription ?? "",
    price: initial?.price ?? "",
    category: initial?.category ?? ("print" as ProductCategory),
    tags: Array.isArray(initial?.tags) ? initial.tags.join(", ") : "",
    coverImage: initial?.coverImage ?? "",
    images: Array.isArray(initial?.images) ? initial.images : [],
    featured: initial?.featured ?? false,
    available: initial?.available ?? true,
    downloadable: initial?.downloadable ?? false,
    externalLink: initial?.externalLink ?? "",
  });

  const set = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Image drop handler — uploads immediately and fills coverImage
  const onDrop = useCallback(
    async (accepted: File[]) => {
      const file = accepted[0];
      if (!file) return;
      setUploadingImage(true);

      const fd = new FormData();
      fd.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Upload failed");

        // Set as cover image and add to images array
        setForm((prev) => ({
          ...prev,
          coverImage: json.url,
          images: prev.images.includes(json.url)
            ? prev.images
            : [json.url, ...prev.images],
        }));
        toast.success("Image uploaded!");
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploadingImage(false);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const removeImage = (url: string) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((i) => i !== url),
      coverImage: prev.coverImage === url
        ? prev.images.find((i) => i !== url) ?? ""
        : prev.coverImage,
    }));
  };

  const setCover = (url: string) => set("coverImage", url);

  const handleSubmit = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.description.trim()) { toast.error("Description is required"); return; }

    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      const url = mode === "edit" ? `/api/products/${slug}` : "/api/products";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");

      toast.success(mode === "edit" ? "Product updated!" : "Product created!");
      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Image Upload */}
      <section>
        <h2 className="font-display text-2xl text-ink mb-5">Product Image</h2>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200 mb-5",
            isDragActive
              ? "border-gold bg-gold/5"
              : "border-stone/30 hover:border-gold/60"
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

        {/* Image grid */}
        {form.images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {form.images.map((url) => (
              <div key={url} className="relative group aspect-square">
                <Image
                  src={url}
                  alt="Product"
                  fill
                  className="object-cover"
                  sizes="120px"
                />
                {/* Cover badge */}
                {url === form.coverImage && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gold/90 py-0.5 text-center">
                    <span className="text-[9px] tracking-widest uppercase text-ink font-semibold">Cover</span>
                  </div>
                )}
                {/* Hover controls */}
                <div className="absolute inset-0 bg-ink/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {url !== form.coverImage && (
                    <button
                      onClick={() => setCover(url)}
                      title="Set as cover"
                      className="bg-gold text-ink p-1 rounded-full"
                    >
                      <Check size={12} />
                    </button>
                  )}
                  <button
                    onClick={() => removeImage(url)}
                    title="Remove"
                    className="bg-rust text-white p-1 rounded-full"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}
            {/* Add more slot */}
            <div
              {...getRootProps()}
              className="aspect-square border-2 border-dashed border-stone/20 flex items-center justify-center cursor-pointer hover:border-gold/50 transition-colors"
            >
              <input {...getInputProps()} />
              <Upload size={16} className="text-faint" />
            </div>
          </div>
        )}
      </section>

      {/* Basic Info */}
      <section>
        <h2 className="font-display text-2xl text-ink mb-5">Product Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs tracking-widest uppercase text-muted mb-2">
              Title <span className="text-rust">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Old City Map Print"
              className="w-full bg-ivory border border-stone/20 px-4 py-3 text-ink text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs tracking-widest uppercase text-muted mb-2">
              Short Description <span className="text-rust">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="One to two sentences shown in product cards and search results."
              rows={2}
              className="w-full bg-ivory border border-stone/20 px-4 py-3 text-ink text-sm focus:outline-none focus:border-gold transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-muted mb-2">
              Price
            </label>
            <input
              type="text"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="₱1,200.00"
              className="w-full bg-ivory border border-stone/20 px-4 py-3 text-ink text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-muted mb-2">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full bg-ivory border border-stone/20 px-4 py-3 text-ink text-sm focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
            >
              {CATEGORIES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs tracking-widest uppercase text-muted mb-2">
              Tags <span className="text-faint">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="art print, vintage, wall art, map"
              className="w-full bg-ivory border border-stone/20 px-4 py-3 text-ink text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs tracking-widest uppercase text-muted mb-2">
              Longer Description <span className="text-faint">(optional, Markdown supported)</span>
            </label>
            <textarea
              value={form.longDescription}
              onChange={(e) => set("longDescription", e.target.value)}
              placeholder="Detailed description shown on the product page. Markdown formatting works here."
              rows={5}
              className="w-full bg-ivory border border-stone/20 px-4 py-3 text-ink text-sm focus:outline-none focus:border-gold transition-colors resize-y font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs tracking-widest uppercase text-muted mb-2">
              External Link <span className="text-faint">(Etsy, Gumroad, etc.)</span>
            </label>
            <input
              type="url"
              value={form.externalLink}
              onChange={(e) => set("externalLink", e.target.value)}
              placeholder="https://etsy.com/listing/..."
              className="w-full bg-ivory border border-stone/20 px-4 py-3 text-ink text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Toggles */}
      <section>
        <h2 className="font-display text-2xl text-ink mb-5">Options</h2>
        <div className="flex flex-col gap-4">
          {[
            { key: "featured", label: "Featured on homepage", desc: "Appears in the Selected Works section" },
            { key: "downloadable", label: "Digital download", desc: "Shows a download badge on the card" },
            { key: "available", label: "Available for purchase", desc: "Hides the product from shop if unchecked" },
          ].map(({ key, label, desc }) => (
            <label key={key} className="flex items-start gap-4 cursor-pointer group">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={Boolean(form[key as keyof typeof form])}
                  onChange={(e) => set(key, e.target.checked)}
                />
                <div className={cn(
                  "w-5 h-5 border-2 flex items-center justify-center transition-colors",
                  form[key as keyof typeof form]
                    ? "bg-gold border-gold"
                    : "border-stone/40 group-hover:border-gold"
                )}>
                  {form[key as keyof typeof form] && <Check size={12} className="text-ink" />}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-ink">{label}</p>
                <p className="text-xs text-muted">{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-4 border-t border-stone/10">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="btn-primary"
        >
          {saving ? (
            <><Loader2 size={15} className="animate-spin" /> Saving…</>
          ) : mode === "edit" ? (
            "Save Changes"
          ) : (
            "Publish Product"
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
