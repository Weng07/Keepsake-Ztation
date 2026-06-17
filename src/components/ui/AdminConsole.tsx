"use client";

import { useMemo, useState } from "react";
import { BookOpen, Clipboard, Image as ImageIcon, Package, Sparkles, Upload } from "lucide-react";
import toast from "react-hot-toast";
import ImageUploader from "@/components/ui/ImageUploader";

const fieldClass = "w-full border border-stone/15 bg-parchment/70 px-4 py-3 text-sm text-ink outline-none transition focus:border-gold";
const labelClass = "text-[10px] font-semibold uppercase tracking-[0.22em] text-muted";

export default function AdminConsole() {
  const [product, setProduct] = useState({
    title: "Brass Landmark Keychain",
    slug: "brass-landmark-keychain",
    description: "A polished brass keychain designed as a compact travel keepsake.",
    price: "$22.00",
    category: "accessory",
    image: "/images/products/keychain.jpg",
  });
  const [post, setPost] = useState({
    title: "How to Choose a Meaningful Souvenir",
    slug: "how-to-choose-a-meaningful-souvenir",
    excerpt: "A simple guide to selecting keepsakes that feel personal, useful, and beautiful.",
    image: "/images/blog/studio-table.jpg",
  });

  const today = new Date().toISOString().slice(0, 10);

  const productMarkdown = useMemo(() => `---
title: "${product.title}"
description: "${product.description}"
price: "${product.price}"
category: "${product.category}"
tags: ["souvenir", "gift"]
coverImage: "${product.image}"
images: ["${product.image}"]
featured: false
available: true
downloadable: false
externalLink: ""
createdAt: "${today}"
updatedAt: "${today}"
---

Write the longer product description here. Explain the material, size, story, and gifting use.`, [product, today]);

  const blogMarkdown = useMemo(() => `---
title: "${post.title}"
excerpt: "${post.excerpt}"
date: "${today}"
author: "Keepsake Ztation Studio"
tags: ["souvenir", "studio"]
coverImage: "${post.image}"
published: true
---

Start writing your blog here.

## Main idea

Explain the idea in a clear and friendly way.

## Studio note

Add a practical note, behind-the-scenes detail, or product story.`, [post, today]);

  async function copy(text: string, type: string) {
    await navigator.clipboard.writeText(text);
    toast.success(`${type} copied`);
  }

  return (
    <div className="space-y-10">
      <section className="grid grid-cols-1 lg:grid-cols-[0.82fr_1.18fr] gap-6">
        <div className="bg-ink p-8 text-mist relative overflow-hidden">
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full border border-gold/20" />
          <div className="absolute -bottom-20 left-8 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
          <p className="section-label mb-4">Command Desk</p>
          <h2 className="font-display text-4xl leading-tight mb-5">Manage products, images, and journal drafts without touching chaos.</h2>
          <p className="text-sm text-mist/60 leading-relaxed">Upload images, copy clean Markdown templates, then place product files in content/products and blog files in content/blog. The layout reads those files automatically.</p>
          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            {["Upload", "Copy", "Publish"].map((item) => (
              <div key={item} className="border border-gold/20 bg-white/5 px-3 py-4">
                <Sparkles size={16} className="mx-auto mb-2 text-gold" />
                <p className="text-[10px] uppercase tracking-widest text-mist/70">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-ivory p-8 shadow-sm border border-stone/10">
          <div className="flex items-center gap-3 mb-5">
            <Upload size={18} className="text-gold" />
            <div>
              <h3 className="font-display text-2xl text-ink">Image Upload Studio</h3>
              <p className="text-xs text-muted">Uploaded files save to public/uploads and return copy-ready paths.</p>
            </div>
          </div>
          <ImageUploader />
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-ivory border border-stone/10 p-7 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Package className="text-gold" size={18} />
            <div>
              <h3 className="font-display text-2xl text-ink">Product Builder</h3>
              <p className="text-xs text-muted">Create content for content/products/{product.slug || "your-product"}.md</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {[
              ["Title", "title"],
              ["Slug", "slug"],
              ["Price", "price"],
              ["Category", "category"],
            ].map(([label, key]) => (
              <label key={key} className="space-y-2">
                <span className={labelClass}>{label}</span>
                <input className={fieldClass} value={product[key as keyof typeof product]} onChange={(e) => setProduct({ ...product, [key]: e.target.value })} />
              </label>
            ))}
          </div>
          <label className="space-y-2 block mb-4">
            <span className={labelClass}>Description</span>
            <textarea className={fieldClass} rows={3} value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} />
          </label>
          <label className="space-y-2 block mb-5">
            <span className={labelClass}>Image path</span>
            <input className={fieldClass} value={product.image} onChange={(e) => setProduct({ ...product, image: e.target.value })} />
          </label>
          <button onClick={() => copy(productMarkdown, "Product Markdown")} className="btn-primary">
            <Clipboard size={15} /> Copy Product Markdown
          </button>
          <pre className="mt-5 max-h-80 overflow-auto bg-ink p-5 text-xs leading-relaxed text-gold">{productMarkdown}</pre>
        </div>

        <div className="bg-ivory border border-stone/10 p-7 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="text-gold" size={18} />
            <div>
              <h3 className="font-display text-2xl text-ink">Blog Writer</h3>
              <p className="text-xs text-muted">Create content for content/blog/{post.slug || "your-post"}.md</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <label className="space-y-2">
              <span className={labelClass}>Title</span>
              <input className={fieldClass} value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} />
            </label>
            <label className="space-y-2">
              <span className={labelClass}>Slug</span>
              <input className={fieldClass} value={post.slug} onChange={(e) => setPost({ ...post, slug: e.target.value })} />
            </label>
          </div>
          <label className="space-y-2 block mb-4">
            <span className={labelClass}>Excerpt</span>
            <textarea className={fieldClass} rows={3} value={post.excerpt} onChange={(e) => setPost({ ...post, excerpt: e.target.value })} />
          </label>
          <label className="space-y-2 block mb-5">
            <span className={labelClass}>Cover image path</span>
            <input className={fieldClass} value={post.image} onChange={(e) => setPost({ ...post, image: e.target.value })} />
          </label>
          <button onClick={() => copy(blogMarkdown, "Blog Markdown")} className="btn-primary">
            <Clipboard size={15} /> Copy Blog Markdown
          </button>
          <pre className="mt-5 max-h-80 overflow-auto bg-ink p-5 text-xs leading-relaxed text-gold">{blogMarkdown}</pre>
        </div>
      </section>

      <section className="bg-gold/10 border border-gold/30 p-6">
        <div className="flex items-start gap-3">
          <ImageIcon size={16} className="text-gold mt-0.5 shrink-0" />
          <div className="text-sm text-muted space-y-1">
            <p><strong className="text-ink">Image path tip:</strong> sample product images live in <code className="bg-mist px-1 py-0.5">public/images/products/</code>.</p>
            <p>Replace a JPG there and keep the same path, or update <code className="bg-mist px-1 py-0.5">coverImage</code> in the product Markdown file.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
