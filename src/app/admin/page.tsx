import type { Metadata } from "next";
import ImageUploader from "@/components/ui/ImageUploader";
import { Upload, BookOpen, Package, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin — Upload & Manage",
};

export default function AdminPage() {
  return (
    <div className="pt-24 min-h-screen bg-parchment">
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16">
        <p className="section-label mb-3">Studio Admin</p>
        <h1 className="font-display text-4xl text-ink mb-2">Content Manager</h1>
        <p className="text-muted mb-12">Upload images, and manage your content files.</p>

        {/* Upload */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <Upload size={16} className="text-gold" />
            <h2 className="font-display text-2xl text-ink">Upload Images</h2>
          </div>
          <ImageUploader />
        </section>

        {/* How-to: Products */}
        <section className="mb-10 bg-ivory p-8">
          <div className="flex items-center gap-3 mb-4">
            <Package size={16} className="text-gold" />
            <h2 className="font-display text-2xl text-ink">Adding a Product</h2>
          </div>
          <p className="text-sm text-muted mb-4">Create a file at <code className="bg-mist px-1 py-0.5 text-xs">content/products/your-product-slug.md</code> with this frontmatter:</p>
          <pre className="bg-ink text-gold text-xs p-5 overflow-x-auto leading-relaxed">
{`---
title: "My Product"
description: "Short description shown in cards."
price: "$24.00"
category: "print"        # souvenir | print | digital | sticker | poster | apparel | accessory | other
tags: ["art", "print"]
coverImage: "/uploads/my-image.jpg"
images: ["/uploads/my-image.jpg", "/uploads/detail.jpg"]
featured: true
available: true
downloadable: false
externalLink: "https://etsy.com/listing/..."
createdAt: "2025-01-15"
updatedAt: "2025-01-15"
---

Optional longer description here in Markdown.`}
          </pre>
          <p className="text-xs text-muted mt-4">Run <code className="bg-mist px-1 py-0.5">npm run new:product</code> to generate this file automatically.</p>
        </section>

        {/* How-to: Blog */}
        <section className="mb-10 bg-ivory p-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen size={16} className="text-gold" />
            <h2 className="font-display text-2xl text-ink">Writing a Blog Post</h2>
          </div>
          <p className="text-sm text-muted mb-4">Create a file at <code className="bg-mist px-1 py-0.5 text-xs">content/blog/your-post-slug.md</code> with this frontmatter:</p>
          <pre className="bg-ink text-gold text-xs p-5 overflow-x-auto leading-relaxed">
{`---
title: "Post Title"
excerpt: "One-sentence summary shown in card previews."
date: "2025-01-15"
author: "Your Name"
tags: ["design", "process"]
coverImage: "/uploads/cover.jpg"
published: true
---

Your blog post content in **Markdown** goes here.

## A Heading

More text...`}
          </pre>
          <p className="text-xs text-muted mt-4">Run <code className="bg-mist px-1 py-0.5">npm run new:blog</code> to generate this file automatically.</p>
        </section>

        <section className="bg-gold/10 border border-gold/30 p-6">
          <div className="flex items-start gap-3">
            <Info size={16} className="text-gold mt-0.5 shrink-0" />
            <div className="text-sm text-muted space-y-1">
              <p><strong className="text-ink">Tip:</strong> After uploading images, copy the path from the output above and paste it into your content file's <code>coverImage</code> field.</p>
              <p>Images are saved to <code>public/uploads/</code> and served at <code>/uploads/filename.jpg</code>.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
