"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  LockKeyhole,
  Package,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import toast from "react-hot-toast";

const fieldClass =
  "w-full border border-stone/15 bg-parchment/75 px-4 py-3 text-sm text-ink outline-none transition focus:border-gold focus:bg-ivory";
const labelClass = "text-[10px] font-semibold uppercase tracking-[0.22em] text-muted";
const panelClass = "bg-ivory border border-stone/10 p-7 shadow-sm";

type SaveResult = {
  ok?: boolean;
  message?: string;
  slug?: string;
  image?: string;
  path?: string;
  error?: string;
};

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminConsole() {
  const today = new Date().toISOString().slice(0, 10);
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingBlog, setSavingBlog] = useState(false);
  const [lastProduct, setLastProduct] = useState<SaveResult | null>(null);
  const [lastBlog, setLastBlog] = useState<SaveResult | null>(null);

  const [product, setProduct] = useState({
    title: "Brass Landmark Keychain",
    slug: "brass-landmark-keychain",
    description: "A polished brass keychain designed as a compact travel keepsake.",
    longDescription:
      "Write a longer description here. Mention the material, size, story, and why it makes a meaningful gift.",
    price: "$22.00",
    category: "accessory",
    tags: "souvenir, gift, travel",
    featured: false,
    available: true,
  });

  const [blog, setBlog] = useState({
    title: "How to Choose a Meaningful Souvenir",
    slug: "how-to-choose-a-meaningful-souvenir",
    excerpt: "A simple guide to selecting keepsakes that feel personal, useful, and beautiful.",
    content:
      "Start writing your blog here.\n\n## Main idea\n\nExplain the idea clearly.\n\n## Studio note\n\nAdd a practical note, behind-the-scenes detail, or product story.",
    author: "Keepsake Ztation Studio",
    tags: "souvenir, studio",
    published: true,
  });

  const productHelp = useMemo(
    () => [
      "Fill out the product details.",
      "Choose a product photo from your computer.",
      "Click Save Product. The site writes the image and product file automatically.",
    ],
    []
  );

  const blogHelp = useMemo(
    () => [
      "Write the title, excerpt, and full blog body.",
      "Choose a cover photo.",
      "Click Publish Blog. The Journal page updates after refresh.",
    ],
    []
  );

  function updateProduct(key: string, value: string | boolean) {
    setProduct((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "title" && !prev.slug ? { slug: makeSlug(String(value)) } : {}),
    }));
  }

  function updateBlog(key: string, value: string | boolean) {
    setBlog((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "title" && !prev.slug ? { slug: makeSlug(String(value)) } : {}),
    }));
  }

  async function saveProduct(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingProduct(true);
    setLastProduct(null);

    try {
      const form = new FormData(e.currentTarget);
      const res = await fetch("/api/products", { method: "POST", body: form });
      const json: SaveResult = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Product save failed");
      setLastProduct(json);
      toast.success("Product saved and published");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Product save failed";
      toast.error(message);
      setLastProduct({ error: message });
    } finally {
      setSavingProduct(false);
    }
  }

  async function saveBlog(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingBlog(true);
    setLastBlog(null);

    try {
      const form = new FormData(e.currentTarget);
      const res = await fetch("/api/blogs", { method: "POST", body: form });
      const json: SaveResult = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Blog save failed");
      setLastBlog(json);
      toast.success("Blog saved and published");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Blog save failed";
      toast.error(message);
      setLastBlog({ error: message });
    } finally {
      setSavingBlog(false);
    }
  }

  return (
    <div className="space-y-10">
      <section className="grid grid-cols-1 lg:grid-cols-[0.78fr_1.22fr] gap-6">
        <div className="bg-ink p-8 text-mist relative overflow-hidden">
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full border border-gold/20" />
          <div className="absolute -bottom-20 left-8 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
          <p className="section-label mb-4">Command Desk</p>
          <h2 className="font-display text-4xl leading-tight mb-5">
            Publish products and blogs straight from the website.
          </h2>
          <p className="text-sm text-mist/60 leading-relaxed">
            No code editing. No copying image paths. Upload a photo, fill in the form, save, then refresh the public page.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            {["Upload", "Save", "Refresh"].map((item) => (
              <div key={item} className="border border-gold/20 bg-white/5 px-3 py-4">
                <Sparkles size={16} className="mx-auto mb-2 text-gold" />
                <p className="text-[10px] uppercase tracking-widest text-mist/70">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-ivory p-8 shadow-sm border border-stone/10">
          <div className="flex items-center gap-3 mb-5">
            <LockKeyhole size={18} className="text-gold" />
            <div>
              <h3 className="font-display text-2xl text-ink">Private Admin Note</h3>
              <p className="text-xs text-muted">The Admin link has been removed from public header and footer navigation.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-parchment/70 p-5 border border-stone/10">
              <p className="section-label mb-3">Products</p>
              <ul className="space-y-2 text-sm text-muted">
                {productHelp.map((item) => (
                  <li key={item} className="flex gap-2"><CheckCircle2 size={14} className="text-gold mt-0.5 shrink-0" />{item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-parchment/70 p-5 border border-stone/10">
              <p className="section-label mb-3">Blogs</p>
              <ul className="space-y-2 text-sm text-muted">
                {blogHelp.map((item) => (
                  <li key={item} className="flex gap-2"><CheckCircle2 size={14} className="text-gold mt-0.5 shrink-0" />{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <form onSubmit={saveProduct} className={panelClass}>
          <div className="flex items-center gap-3 mb-6">
            <Package className="text-gold" size={18} />
            <div>
              <h3 className="font-display text-2xl text-ink">Product Publisher</h3>
              <p className="text-xs text-muted">Save a product and photo directly to the website.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <label className="space-y-2">
              <span className={labelClass}>Title</span>
              <input name="title" required className={fieldClass} value={product.title} onChange={(e) => updateProduct("title", e.target.value)} />
            </label>
            <label className="space-y-2">
              <span className={labelClass}>Slug</span>
              <input name="slug" required className={fieldClass} value={product.slug} onChange={(e) => updateProduct("slug", makeSlug(e.target.value))} />
            </label>
            <label className="space-y-2">
              <span className={labelClass}>Price</span>
              <input name="price" className={fieldClass} value={product.price} onChange={(e) => updateProduct("price", e.target.value)} />
            </label>
            <label className="space-y-2">
              <span className={labelClass}>Category</span>
              <select name="category" className={fieldClass} value={product.category} onChange={(e) => updateProduct("category", e.target.value)}>
                {['souvenir','print','digital','sticker','poster','apparel','accessory','other'].map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </label>
          </div>

          <label className="space-y-2 block mb-4">
            <span className={labelClass}>Short description</span>
            <textarea name="description" required className={fieldClass} rows={3} value={product.description} onChange={(e) => updateProduct("description", e.target.value)} />
          </label>
          <label className="space-y-2 block mb-4">
            <span className={labelClass}>Long description</span>
            <textarea name="longDescription" className={fieldClass} rows={6} value={product.longDescription} onChange={(e) => updateProduct("longDescription", e.target.value)} />
          </label>
          <label className="space-y-2 block mb-4">
            <span className={labelClass}>Tags</span>
            <input name="tags" className={fieldClass} value={product.tags} onChange={(e) => updateProduct("tags", e.target.value)} placeholder="souvenir, gift, travel" />
          </label>
          <label className="space-y-2 block mb-5">
            <span className={labelClass}>Product photo</span>
            <input name="image" required type="file" accept="image/*" className="w-full border border-dashed border-stone/30 bg-parchment/70 px-4 py-6 text-sm text-muted file:mr-4 file:border-0 file:bg-ink file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-widest file:text-gold" />
          </label>

          <div className="flex items-center gap-5 mb-5 text-sm text-muted">
            <label className="flex items-center gap-2"><input name="featured" type="checkbox" checked={product.featured} onChange={(e) => updateProduct("featured", e.target.checked)} /> Featured</label>
            <label className="flex items-center gap-2"><input name="available" type="checkbox" checked={product.available} onChange={(e) => updateProduct("available", e.target.checked)} /> Available</label>
          </div>

          <button disabled={savingProduct} className="btn-primary disabled:opacity-60" type="submit">
            {savingProduct ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />} Save Product
          </button>

          {lastProduct && (
            <div className="mt-5 bg-mist p-4 text-xs text-muted space-y-1">
              {lastProduct.error ? <p className="text-rust">{lastProduct.error}</p> : <p><strong className="text-ink">Saved:</strong> /products/{lastProduct.slug}</p>}
              {lastProduct.image && <p className="font-mono text-ink select-all">{lastProduct.image}</p>}
            </div>
          )}
        </form>

        <form onSubmit={saveBlog} className={panelClass}>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="text-gold" size={18} />
            <div>
              <h3 className="font-display text-2xl text-ink">Blog Publisher</h3>
              <p className="text-xs text-muted">Write and publish a journal post without opening the code.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <label className="space-y-2">
              <span className={labelClass}>Title</span>
              <input name="title" required className={fieldClass} value={blog.title} onChange={(e) => updateBlog("title", e.target.value)} />
            </label>
            <label className="space-y-2">
              <span className={labelClass}>Slug</span>
              <input name="slug" required className={fieldClass} value={blog.slug} onChange={(e) => updateBlog("slug", makeSlug(e.target.value))} />
            </label>
          </div>
          <label className="space-y-2 block mb-4">
            <span className={labelClass}>Excerpt</span>
            <textarea name="excerpt" required className={fieldClass} rows={3} value={blog.excerpt} onChange={(e) => updateBlog("excerpt", e.target.value)} />
          </label>
          <label className="space-y-2 block mb-4">
            <span className={labelClass}>Full blog body</span>
            <textarea name="content" required className={fieldClass} rows={10} value={blog.content} onChange={(e) => updateBlog("content", e.target.value)} />
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <label className="space-y-2">
              <span className={labelClass}>Author</span>
              <input name="author" className={fieldClass} value={blog.author} onChange={(e) => updateBlog("author", e.target.value)} />
            </label>
            <label className="space-y-2">
              <span className={labelClass}>Tags</span>
              <input name="tags" className={fieldClass} value={blog.tags} onChange={(e) => updateBlog("tags", e.target.value)} />
            </label>
          </div>
          <label className="space-y-2 block mb-5">
            <span className={labelClass}>Cover photo</span>
            <input name="image" required type="file" accept="image/*" className="w-full border border-dashed border-stone/30 bg-parchment/70 px-4 py-6 text-sm text-muted file:mr-4 file:border-0 file:bg-ink file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-widest file:text-gold" />
          </label>
          <input name="date" type="hidden" value={today} />
          <label className="mb-5 flex items-center gap-2 text-sm text-muted"><input name="published" type="checkbox" checked={blog.published} onChange={(e) => updateBlog("published", e.target.checked)} /> Published</label>

          <button disabled={savingBlog} className="btn-primary disabled:opacity-60" type="submit">
            {savingBlog ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />} Publish Blog
          </button>

          {lastBlog && (
            <div className="mt-5 bg-mist p-4 text-xs text-muted space-y-1">
              {lastBlog.error ? <p className="text-rust">{lastBlog.error}</p> : <p><strong className="text-ink">Saved:</strong> /blog/{lastBlog.slug}</p>}
              {lastBlog.image && <p className="font-mono text-ink select-all">{lastBlog.image}</p>}
            </div>
          )}
        </form>
      </section>

      <section className="bg-gold/10 border border-gold/30 p-6">
        <div className="flex items-start gap-3">
          <ImageIcon size={16} className="text-gold mt-0.5 shrink-0" />
          <div className="text-sm text-muted space-y-1">
            <p><strong className="text-ink">Where things save:</strong> product photos go to <code className="bg-mist px-1 py-0.5">public/uploads/products/</code> and blog photos go to <code className="bg-mist px-1 py-0.5">public/uploads/blogs/</code>.</p>
            <p>The matching product/blog Markdown file is created automatically inside <code className="bg-mist px-1 py-0.5">content/products/</code> or <code className="bg-mist px-1 py-0.5">content/blog/</code>.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
