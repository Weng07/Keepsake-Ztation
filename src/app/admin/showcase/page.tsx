"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2, Star, Check } from "lucide-react";
import type { Product } from "@/types";
import { categoryLabel, cn } from "@/lib/utils";

export default function ShowcaseCuratorPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);

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

  const featuredCount = products.filter((p) => p.featured).length;

  const toggleFeatured = async (product: Product) => {
    setSavingSlug(product.slug);

    const nextFeatured = !product.featured;

    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.slug === product.slug ? { ...p, featured: nextFeatured } : p))
    );

    try {
      const payload = { ...product, featured: nextFeatured };
      const res = await fetch(`/api/products/${product.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Update failed");
      toast.success(
        nextFeatured ? `Added "${product.title}" to showcase` : `Removed "${product.title}" from showcase`
      );
    } catch (err: unknown) {
      // Roll back on failure
      setProducts((prev) =>
        prev.map((p) => (p.slug === product.slug ? { ...p, featured: !nextFeatured } : p))
      );
      toast.error(err instanceof Error ? err.message : "Could not update showcase");
    } finally {
      setSavingSlug(null);
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

        <div className="mb-10">
          <p className="section-label mb-3">Curate</p>
          <h1 className="font-display text-4xl text-ink mb-3">Homepage Showcase</h1>
          <p className="text-muted text-sm max-w-xl">
            Select which already-uploaded products appear in the &ldquo;Selected Works&rdquo;
            section on your homepage. Currently showing{" "}
            <strong className="text-ink">{featuredCount}</strong> featured product
            {featuredCount === 1 ? "" : "s"} (the homepage displays up to 3).
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={28} className="animate-spin text-gold" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-ivory">
            <p className="font-display text-3xl text-ink mb-3">No products yet</p>
            <p className="text-muted text-sm mb-6">Add products first, then come back to curate your showcase.</p>
            <Link href="/admin/products/new" className="btn-primary inline-flex">
              Add a Product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <button
                key={product.slug}
                onClick={() => toggleFeatured(product)}
                disabled={savingSlug === product.slug}
                className={cn(
                  "group relative text-left bg-ivory border-2 overflow-hidden transition-all duration-200 disabled:opacity-70",
                  product.featured ? "border-gold" : "border-transparent hover:border-gold/40"
                )}
              >
                {/* Thumbnail */}
                <div className="aspect-product relative bg-mist">
                  {product.coverImage ? (
                    <Image
                      src={product.coverImage}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-4xl text-faint">✦</span>
                    </div>
                  )}

                  {/* Selection indicator */}
                  <div
                    className={cn(
                      "absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-colors",
                      product.featured ? "bg-gold text-ink" : "bg-ink/40 text-mist/80 group-hover:bg-ink/60"
                    )}
                  >
                    {savingSlug === product.slug ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : product.featured ? (
                      <Check size={14} />
                    ) : (
                      <Star size={14} />
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="section-label mb-1">{categoryLabel(product.category)}</p>
                  <h3 className="font-display text-lg text-ink leading-tight">{product.title}</h3>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
