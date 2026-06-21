import Link from "next/link";
import { Instagram, Twitter, Facebook } from "lucide-react";
import { siteConfig } from "@/lib/config";

export default function Footer() {
  const year = new Date().getFullYear();

  // Defensive fallback: never crash the Footer even if siteConfig.social is
  // missing or only partially filled in. This is what previously caused
  // "Cannot read properties of undefined (reading 'instagram')".
  const social = siteConfig.social ?? {};

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
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-mist/50 hover:text-gold transition-colors"
                >
                  <Instagram size={18} />
                </a>
              )}
              {social.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-mist/50 hover:text-gold transition-colors"
                >
                  <Facebook size={18} />
                </a>
              )}
              {social.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="text-mist/50 hover:text-gold transition-colors"
                >
                  <Twitter size={18} />
                </a>
              )}
              {!social.instagram && !social.facebook && !social.twitter && (
                <p className="text-xs text-mist/30">
                  Add your social links in src/lib/config.ts
                </p>
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
