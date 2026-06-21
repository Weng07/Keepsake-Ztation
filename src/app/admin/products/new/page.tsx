import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/ui/ProductForm";

export const metadata: Metadata = {
  title: "Add New Product",
};

export default function NewProductPage() {
  return (
    <div className="pt-24 min-h-screen bg-parchment">
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        <p className="section-label mb-3">New Listing</p>
        <h1 className="font-display text-4xl text-ink mb-10">Add a Product</h1>

        <ProductForm mode="create" />
      </div>
    </div>
  );
}
