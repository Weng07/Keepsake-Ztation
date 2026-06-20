"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/blog", label: "Journal" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // The navbar background stays transparent on every page, always — this
  // is just about text color. Only the homepage opens with a dark,
  // full-height hero directly under the header; every other page
  // (Shop, Journal, About, product/post detail, admin) opens straight
  // into light parchment. So gold/light text is used on the homepage,
  // and dark ink text everywhere else, to keep the logo and nav legible
  // against whatever's actually behind a see-through bar.
  const isHomepage = pathname === "/";

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "font-display text-xl tracking-wide",
            isHomepage ? "text-gold" : "text-ink"
          )}
        >
          {siteConfig.name}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-xs font-medium tracking-widest uppercase transition-colors duration-200",
                pathname === href
                  ? "text-gold"
                  : isHomepage
                    ? "text-mist/70 hover:text-gold"
                    : "text-ink/60 hover:text-gold"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className={cn("md:hidden p-1", isHomepage ? "text-mist" : "text-ink")}
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu — solid backdrop only while open, so the dropdown
          itself is readable regardless of what's behind it */}
      {open && (
        <div className="md:hidden bg-ink/95 backdrop-blur-md border-t border-gold/10 px-6 py-6 flex flex-col gap-5">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sm font-medium tracking-widest uppercase",
                pathname === href ? "text-gold" : "text-mist/70"
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
