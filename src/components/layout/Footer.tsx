import Link from "next/link";
import { Instagram, Twitter } from "lucide-react";
import { siteConfig } from "@/lib/config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-mist/70">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <p className="font-display text-2xl text-mist mb-3">
              {siteConfig.name}
            </p>
            <p className="text-sm text-mist/50 max-w-xs leading-relaxed">
              {siteConfig.tagline}
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="section-label text-gold mb-4">Navigate</p>
            <nav className="flex flex-col gap-3">
              {[
                { href: "/", label: "Home" },
                { href: "/products", label: "Shop" },
                { href: "/blog", label: "Journal" },
                { href: "/about", label: "About" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-mist/60 hover:text-gold transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="section-label text-gold mb-4">Connect</p>
            <p className="text-sm text-mist/60 mb-4">
              <a
                href={`mailto:${siteConfig.email}`}
                className="hover:text-gold transition-colors"
              >
                {siteConfig.email}
              </a>
            </p>
            <div className="flex gap-4">
              {siteConfig.social.instagram && (
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-mist/50 hover:text-gold transition-colors"
                >
                  <Instagram size={18} />
                </a>
              )}
              {siteConfig.social.twitter && (
                <a
                  href={siteConfig.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="text-mist/50 hover:text-gold transition-colors"
                >
                  <Twitter size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-mist/30 tracking-wider">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-xs text-mist/20">
            Crafted with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
