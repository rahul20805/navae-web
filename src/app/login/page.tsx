"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
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
      setError("Invalid email or password");
      setLoading(false);
    } else {
      window.location.href = "/account";
    }
  };

  return (
    <main className="container" style={{ padding: "5rem 1rem", minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="card" style={{ padding: "3rem", width: "100%", maxWidth: "450px", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-md)" }}>
        <h1 className="text-primary" style={{ textAlign: "center", marginBottom: "0.5rem" }}>Welcome Back</h1>
        <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "2rem" }}>Log in to access your custom gifts and orders.</p>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: "0.85rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", background: "var(--bg-main)" }} />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <label style={{ fontWeight: 500 }}>Password</label>
              <Link href="/forgot-password" style={{ fontSize: "0.85rem", color: "var(--primary)", textDecoration: "none" }}>Forgot Password?</Link>
            </div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: "0.85rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", background: "var(--bg-main)" }} />
          </div>
          
          {error && <div style={{ color: "var(--error)", fontSize: "0.9rem", padding: "0.5rem", background: "rgba(255,0,0,0.05)", borderRadius: "var(--radius-sm)", textAlign: "center" }}>{error}</div>}
          
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", padding: "0.85rem", marginTop: "0.5rem" }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center", borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
          <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", margin: 0 }}>
            Don't have an account? <Link href="/register" style={{ color: "var(--primary)", fontWeight: 600, marginLeft: "0.5rem" }}>Create Account</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
