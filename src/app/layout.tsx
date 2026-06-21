import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/lib/config";
import "@/styles/globals.css";

// next/font self-hosts these files at build time and inlines the CSS, which
// removes the render-blocking request to fonts.googleapis.com that the
// previous <link> tag made on every page load. This is the single biggest
// fix for perceived page-load speed on this site. The variable names are
// distinct from the Tailwind theme tokens (--font-display / --font-body in
// globals.css) so the two layers don't collide; the theme tokens reference
// these variables directly.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display-family",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body-family",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["souvenir", "art print", "digital download", "handmade", "design"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="grain">
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#f5f3ef",
              border: "1px solid #2a2a2a",
              borderRadius: "0",
              fontSize: "0.875rem",
            },
          }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
