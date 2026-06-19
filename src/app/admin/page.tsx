"use client";

import Link from "next/link";
import { Package, LayoutGrid, BookOpen, PenLine, ArrowRight } from "lucide-react";

const sections = [
  {
    href: "/admin/products/new",
    icon: Package,
    label: "Add New Product",
    description: "Upload a photo, set price and details — goes live instantly.",
    action: "Add Product →",
    accent: true,
  },
  {
    href: "/admin/blog/new",
    icon: PenLine,
    label: "Write New Post",
    description: "Upload a cover photo and write your journal entry — all from this dashboard.",
    action: "Write Post →",
    accent: true,
  },
  {
    href: "/admin/products",
    icon: LayoutGrid,
    label: "Manage Products",
    description: "Edit, update, or remove existing products from your shop.",
    action: "Open Manager →",
    accent: false,
  },
  {
    href: "/admin/blog",
    icon: BookOpen,
    label: "Manage Blog Posts",
    description: "Edit drafts, publish, or remove journal entries.",
    action: "Open Manager →",
    accent: false,
  },
  {
    href: "/admin/showcase",
    icon: LayoutGrid,
    label: "Curate Showcase",
    description: "Pick which products appear in the Featured section on the homepage.",
    action: "Edit Showcase →",
    accent: false,
  },
];

export default function AdminDashboard() {
  return (
    <div className="pt-24 min-h-screen bg-parchment">
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-16">
        <p className="section-label mb-3">Studio Admin</p>
        <h1 className="font-display text-5xl text-ink mb-2">Dashboard</h1>
        <p className="text-muted mb-14">Manage your products, journal, and showcase — all from here.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sections.map(({ href, icon: Icon, label, description, action, accent }) => (
            <Link
              key={href}
              href={href}
              className={`group block p-8 border transition-all duration-200 ${
                accent
                  ? "bg-ink border-ink text-mist hover:bg-stone"
                  : "bg-ivory border-stone/10 hover:border-gold"
              }`}
            >
              <Icon
                size={22}
                className={`mb-5 ${accent ? "text-gold" : "text-gold"}`}
              />
              <h2
                className={`font-display text-2xl mb-2 ${
                  accent ? "text-mist" : "text-ink"
                }`}
              >
                {label}
              </h2>
              <p
                className={`text-sm leading-relaxed mb-5 ${
                  accent ? "text-mist/60" : "text-muted"
                }`}
              >
                {description}
              </p>
              <span
                className={`text-xs tracking-widest uppercase font-medium flex items-center gap-2 transition-colors group-hover:gap-3 ${
                  accent ? "text-gold" : "text-gold"
                }`}
              >
                {action} <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 p-5 bg-gold/10 border border-gold/25 text-sm text-muted">
          <strong className="text-ink">Quick tip:</strong> Everything here — photos,
          products, and posts — is uploaded and saved directly through this dashboard.
          There's no file to copy or paste; visit{" "}
          <Link href="/products" className="text-gold underline">
            /products
          </Link>{" "}
          or{" "}
          <Link href="/blog" className="text-gold underline">
            /blog
          </Link>{" "}
          afterward to see it live.
        </div>
      </div>
    </div>
  );
}
