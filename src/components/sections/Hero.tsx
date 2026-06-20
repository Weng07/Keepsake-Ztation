import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { categoryLabel } from "@/lib/utils";
import type { Product } from "@/types";

interface Props {
  featuredProduct?: Product;
}

export default function Hero({ featuredProduct }: Props) {
  return (
    <section className="relative min-h-screen flex items-center bg-ink overflow-hidden">
      {/* Ambient background — layered for more depth and richness */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-stone/50 via-stone/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/2 h-2/3 bg-gradient-to-tr from-gold/10 via-gold/0 to-transparent" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        {/* Fine grid lines */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #c9a84c 1px, transparent 1px), linear-gradient(to bottom, #c9a84c 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Vignette to keep edges rich and dark */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-16 items-center">
          {/* Copy column */}
          <div className="fade-up">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles size={14} className="text-gold" />
              <p className="section-label">Original Designs, Made by Hand</p>
            </div>

            <h1 className="font-display text-6xl sm:text-7xl lg:text-[5.5rem] text-mist leading-[0.98] mb-8">
              Designed to
              <br />
              <em className="not-italic text-gold relative inline-block">
                be kept.
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="10"
                  viewBox="0 0 300 10"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2,7 C80,2 220,2 298,7"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.5"
                  />
                </svg>
              </em>
            </h1>

            <p className="text-mist/60 text-lg max-w-md leading-relaxed mb-10">
              {siteConfig.description}
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <Link href="/products" className="btn-primary group">
                Explore the Shop
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="btn-outline border-mist/30 text-mist hover:bg-mist hover:text-ink"
              >
                Our Story
              </Link>
            </div>

            {/* Trust / craft markers — fills the lower space with substance,
                not just decoration, and reinforces a premium positioning */}
            <div className="flex flex-wrap gap-x-10 gap-y-6 border-t border-mist/10 pt-8">
              {[
                { value: "100%", label: "Original Designs" },
                { value: "Small Batch", label: "Made to Order" },
                { value: "PH-Based", label: "Studio & Craft" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-2xl text-gold mb-1">{stat.value}</p>
                  <p className="text-[11px] tracking-widest uppercase text-mist/40">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual column — real featured product, or an elegant fallback
              mark so the hero never looks empty even with no products yet */}
          <div className="relative hidden lg:block fade-up" style={{ animationDelay: "150ms" }}>
            <div className="relative aspect-[4/5] max-w-sm mx-auto">
              {/* Frame glow */}
              <div className="absolute -inset-4 bg-gradient-to-br from-gold/20 via-transparent to-transparent rounded-sm blur-2xl" />

              <div className="relative w-full h-full border border-gold/20 p-3">
                <div className="relative w-full h-full overflow-hidden bg-stone">
                  {featuredProduct?.coverImage ? (
                    <Image
                      src={featuredProduct.coverImage}
                      alt={featuredProduct.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 0px, 400px"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-stone to-ink">
                      <span className="font-display text-7xl text-gold/20 select-none">✦</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Caption plate */}
              {featuredProduct && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] bg-ink border border-gold/20 px-5 py-3 text-center shadow-2xl shadow-black/40">
                  <p className="section-label mb-1">
                    {categoryLabel(featuredProduct.category)}
                  </p>
                  <p className="font-display text-base text-mist truncate">
                    {featuredProduct.title}
                  </p>
                </div>
              )}
            </div>

            {/* Orbiting accent mark */}
            <div className="absolute -top-6 -right-6 text-gold/20 font-display text-6xl select-none leading-none">
              ✦
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
}
