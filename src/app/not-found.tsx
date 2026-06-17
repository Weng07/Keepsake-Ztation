import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink flex items-center justify-center text-center px-6">
      <div>
        <p className="font-display text-gold text-8xl mb-6">404</p>
        <h1 className="font-display text-3xl text-mist mb-4">Page not found</h1>
        <p className="text-mist/50 mb-8 text-sm">The page you're looking for doesn't exist or has moved.</p>
        <Link href="/" className="btn-primary">Return Home</Link>
      </div>
    </div>
  );
}
