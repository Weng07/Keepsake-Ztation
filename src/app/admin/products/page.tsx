"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";
import type { Product } from "@/types";
import { categoryLabel } from "@/lib/utils";

export default function ProductManagerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      setProducts(json.products ?? []);
    } catch {
      toast.error("Could not load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (slug: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;

    setDeletingSlug(slug);
    try {
      const res = await fetch(`/api/products/${slug}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Delete failed");
      setProducts((prev) => prev.filter((p) => p.slug !== slug));
      toast.success("Product deleted");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingSlug(null);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-parchment">
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="section-label mb-3">Manage</p>
            <h1 className="font-display text-4xl text-ink">Your Products</h1>
          </div>
          <Link href="/admin/products/new" className="btn-primary">
            <Plus size={16} /> Add Product
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={28} className="animate-spin text-gold" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-ivory">
            <p className="font-display text-3xl text-ink mb-3">No products yet</p>
            <p className="text-muted text-sm mb-6">Add your first product to get started.</p>
            <Link href="/admin/products/new" className="btn-primary inline-flex">
              <Plus size={16} /> Add Product
            </Link>
          </div>
        ) : (
          <div className="bg-ivory divide-y divide-stone/10">
            {products.map((product) => (
              <div
                key={product.slug}
                className="flex items-center gap-5 p-5 hover:bg-mist/40 transition-colors"
              >
                {/* Thumbnail */}
                <div className="relative w-16 h-16 shrink-0 bg-mist overflow-hidden">
                  {product.coverImage ? (
                    <Image
                      src={product.coverImage}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-xl text-faint">✦</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display text-lg text-ink truncate">{product.title}</h3>
                    {product.featured && (
                      <Star size={12} className="text-gold shrink-0" fill="currentColor" />
                    )}
                  </div>
                  <p className="text-xs text-muted">
                    {categoryLabel(product.category)}
                    {product.price ? ` · ${product.price}` : ""}
                    {product.available === false ? " · Hidden" : ""}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/products/${product.slug}`}
                    target="_blank"
                    className="text-xs tracking-widest uppercase text-muted hover:text-gold transition-colors px-2 py-1"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/products/${product.slug}`}
                    className="p-2 text-muted hover:text-gold transition-colors"
                    aria-label="Edit"
                  >
                    <Pencil size={15} />
                  </Link>
                  <button
                    onClick={() => handleDelete(product.slug, product.title)}
                    disabled={deletingSlug === product.slug}
                    className="p-2 text-muted hover:text-rust transition-colors disabled:opacity-50"
                    aria-label="Delete"
                  >
                    {deletingSlug === product.slug ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Trash2 size={15} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
