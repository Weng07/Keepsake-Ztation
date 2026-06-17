"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/config";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-ink overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-stone/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-gold/5 to-transparent" />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #c9a84c 1px, transparent 1px), linear-gradient(to bottom, #c9a84c 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-24 w-full">
        <div className="max-w-3xl">
          <p className="section-label mb-8">
            ✦ Original Designs
          </p>

          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl text-mist leading-[1.0] mb-8">
            Designed to
            <br />
            <em className="not-italic text-gold">be kept.</em>
          </h1>

          <p className="text-mist/60 text-lg max-w-md leading-relaxed mb-12">
            {siteConfig.description}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/products" className="btn-primary group">
              Explore the Shop
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/about" className="btn-outline border-mist/30 text-mist hover:bg-mist hover:text-ink">
              Our Story
            </Link>
          </div>
        </div>

        {/* Decorative corner mark */}
        <div className="absolute bottom-12 right-10 hidden lg:block">
          <div className="text-gold/20 font-display text-8xl select-none leading-none">✦</div>
        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
}
