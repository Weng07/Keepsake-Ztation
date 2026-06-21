import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Once Supabase Storage is configured (see src/lib/supabase.ts),
    // uploaded images are served from https://<project-ref>.supabase.co/...
    // This wildcard pattern allows next/image to fetch and optimize them
    // without needing to know your specific project ref ahead of time.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Local SVG placeholder/sample images are used for products and blog
    // covers. SVG is disabled by default in next/image for security reasons,
    // so it is explicitly allowed here along with a strict CSP for images.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
