import type { Metadata } from "next";
import ProductCard from "@/components/ui/ProductCard";
import { getAllProducts, getCategories } from "@/lib/products";
import { categoryLabel } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse original souvenirs, art prints, and digital goods.",
};

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const all = await getAllProducts();
  const categories = await getCategories();
  const products = category ? all.filter((p) => p.category === category) : all;

  return (
    <div className="pt-24 min-h-screen bg-parchment">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="section-label mb-3">Collection</p>
          <h1 className="font-display text-5xl lg:text-6xl text-ink">
            {category ? categoryLabel(category) : "All Products"}
          </h1>
          <p className="text-muted mt-3">{products.length} item{products.length !== 1 ? "s" : ""}</p>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <Link
              href="/products"
              className={`px-4 py-1.5 text-xs tracking-widest uppercase font-medium border transition-colors ${
                !category ? "bg-ink text-gold border-ink" : "border-stone/30 text-muted hover:border-gold hover:text-gold"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${cat}`}
                className={`px-4 py-1.5 text-xs tracking-widest uppercase font-medium border transition-colors ${
                  category === cat ? "bg-ink text-gold border-ink" : "border-stone/30 text-muted hover:border-gold hover:text-gold"
                }`}
              >
                {categoryLabel(cat)}
              </Link>
            ))}
          </div>
        )}

        {/* Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-ivory">
            <p className="font-display text-3xl text-ink mb-3">Nothing here yet</p>
            <p className="text-muted text-sm">Check back soon — new pieces are on the way.</p>
          </div>
        )}
      </div>
    </div>
  );
}
