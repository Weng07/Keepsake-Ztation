"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock, AlertTriangle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const needsSetup = searchParams.get("setup") === "1";
  const redirectTo = searchParams.get("redirect") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Invalid username or password");
        setLoading(false);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 border border-gold/30 mb-5">
            <Lock size={18} className="text-gold" />
          </div>
          <p className="section-label mb-3">Studio Admin</p>
          <h1 className="font-display text-3xl text-mist">Sign In</h1>
        </div>

        {needsSetup && (
          <div className="mb-6 p-4 bg-gold/10 border border-gold/25 text-sm text-mist/70 flex gap-3">
            <AlertTriangle size={16} className="text-gold shrink-0 mt-0.5" />
            <p>
              Admin login isn&apos;t configured yet. Set{" "}
              <code className="text-gold">ADMIN_USERNAME</code>,{" "}
              <code className="text-gold">ADMIN_PASSWORD</code>, and{" "}
              <code className="text-gold">SESSION_SECRET</code> in your{" "}
              <code className="text-gold">.env.local</code> file, then restart the
              dev server.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs tracking-widest uppercase text-mist/50 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              className="w-full bg-stone/40 border border-mist/15 px-4 py-3 text-mist text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-mist/50 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full bg-stone/40 border border-mist/15 px-4 py-3 text-mist text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          {error && <p className="text-sm text-rust">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
