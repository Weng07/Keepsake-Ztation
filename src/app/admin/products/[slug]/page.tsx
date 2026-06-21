import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/ui/ProductForm";
import { getProductBySlug } from "@/lib/products";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return { title: product ? `Edit — ${product.title}` : "Edit Product" };
}

export default async function EditProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="pt-24 min-h-screen bg-parchment">
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to Manager
        </Link>

        <p className="section-label mb-3">Edit Listing</p>
        <h1 className="font-display text-4xl text-ink mb-10">{product.title}</h1>

        <ProductForm mode="edit" slug={slug} initial={product} />
      </div>
    </div>
  );
}
