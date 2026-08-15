"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || null;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else {
      // Fetch session to determine role-based redirect
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      const role = sessionData?.user?.role;

      if (role === "OWNER" || role === "SUPER_ADMIN") {
        window.location.href = "/admin";
      } else if (callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("/admin")) {
        window.location.href = callbackUrl;
      } else {
        window.location.href = "/account";
      }
    }
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-alt)", padding: "2rem 1rem" }}>
      <div style={{ width: "100%", maxWidth: "460px" }}>
        
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/">
            <img src="/images/logo.jpg" alt="ANANTA" style={{ height: "60px", objectFit: "contain", borderRadius: "6px" }} />
          </Link>
        </div>

        <div className="card" style={{ padding: "2.5rem", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-lg)" }}>
          <h1 className="text-primary" style={{ textAlign: "center", marginBottom: "0.5rem", fontSize: "1.75rem" }}>Welcome Back</h1>
          <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "2rem", fontSize: "0.95rem" }}>
            Log in to your ANANTA account to track orders, bookings and more.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.9rem", color: "var(--text-main)" }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="your@email.com"
                style={{ width: "100%", padding: "0.85rem 1rem", border: "1.5px solid var(--border-color)", borderRadius: "var(--radius-md)", background: "var(--bg-main)", fontSize: "1rem", transition: "border 0.2s" }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-main)" }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize: "0.85rem", color: "var(--primary)", textDecoration: "none" }}>
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                style={{ width: "100%", padding: "0.85rem 1rem", border: "1.5px solid var(--border-color)", borderRadius: "var(--radius-md)", background: "var(--bg-main)", fontSize: "1rem" }}
              />
            </div>

            {error && (
              <div style={{ padding: "0.85rem 1rem", background: "#ffebee", border: "1px solid #ef9a9a", borderRadius: "var(--radius-md)", color: "#c62828", fontSize: "0.9rem", textAlign: "center" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%", padding: "0.95rem", marginTop: "0.25rem", fontSize: "1rem", opacity: loading ? 0.75 : 1 }}
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div style={{ marginTop: "2rem", textAlign: "center", borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", margin: 0 }}>
              New to ANANTA?{" "}
              <Link href="/register" style={{ color: "var(--primary)", fontWeight: 700 }}>
                Create a free account →
              </Link>
            </p>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>← Back to ANANTA</Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
