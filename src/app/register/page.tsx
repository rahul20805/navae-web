"use client";

import { useState } from "react";
import { registerUser } from "@/actions/auth";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const res = await registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (res.success) {
      const signInRes = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (signInRes?.error) {
        setError("Account created! Please log in manually.");
        setLoading(false);
      } else {
        // Always go to /account for newly registered customers
        window.location.href = "/account";
      }
    } else {
      setError(res.error || "Failed to create account. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-alt)", padding: "2rem 1rem" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/">
            <img src="/images/logo.jpg" alt="ANANTA" style={{ height: "60px", objectFit: "contain", borderRadius: "6px" }} />
          </Link>
        </div>

        <div className="card" style={{ padding: "2.5rem", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-lg)" }}>
          <h1 className="text-primary" style={{ textAlign: "center", marginBottom: "0.5rem", fontSize: "1.75rem" }}>Create Account</h1>
          <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "2rem", fontSize: "0.95rem" }}>
            Join ANANTA to order handmade gifts, book classes and more.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.9rem" }}>Full Name *</label>
              <input
                type="text"
                required
                autoComplete="name"
                placeholder="Rahul Sharma"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                style={{ width: "100%", padding: "0.85rem 1rem", border: "1.5px solid var(--border-color)", borderRadius: "var(--radius-md)", background: "var(--bg-main)", fontSize: "1rem" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.9rem" }}>Email Address *</label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                style={{ width: "100%", padding: "0.85rem 1rem", border: "1.5px solid var(--border-color)", borderRadius: "var(--radius-md)", background: "var(--bg-main)", fontSize: "1rem" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.9rem" }}>Phone Number <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span></label>
              <input
                type="tel"
                autoComplete="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: "100%", padding: "0.85rem 1rem", border: "1.5px solid var(--border-color)", borderRadius: "var(--radius-md)", background: "var(--bg-main)", fontSize: "1rem" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.9rem" }}>Password *</label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  style={{ width: "100%", padding: "0.85rem 1rem", border: "1.5px solid var(--border-color)", borderRadius: "var(--radius-md)", background: "var(--bg-main)", fontSize: "1rem" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.9rem" }}>Confirm *</label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={formData.confirm}
                  onChange={e => setFormData({ ...formData, confirm: e.target.value })}
                  style={{ width: "100%", padding: "0.85rem 1rem", border: "1.5px solid var(--border-color)", borderRadius: "var(--radius-md)", background: "var(--bg-main)", fontSize: "1rem" }}
                />
              </div>
            </div>

            {error && (
              <div style={{ padding: "0.85rem 1rem", background: "#ffebee", border: "1px solid #ef9a9a", borderRadius: "var(--radius-md)", color: "#c62828", fontSize: "0.9rem" }}>
                {error}
              </div>
            )}

            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "-0.25rem" }}>
              By creating an account you agree to our{" "}
              <Link href="/privacy" style={{ color: "var(--primary)" }}>Privacy Policy</Link> and{" "}
              <Link href="/terms" style={{ color: "var(--primary)" }}>Terms of Service</Link>.
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%", padding: "0.95rem", fontSize: "1rem", marginTop: "0.25rem", opacity: loading ? 0.75 : 1 }}
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>
          </form>

          <div style={{ marginTop: "2rem", textAlign: "center", borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", margin: 0 }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>Sign in →</Link>
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
