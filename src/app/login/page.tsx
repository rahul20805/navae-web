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
      // The secure cookie is now set by the browser. 
      // Force a hard navigation to the account page, which will server-side route Admins to /admin.
      window.location.href = "/account";
    }
  };

  return (
    <main className="container" style={{ padding: "5rem 1rem", minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="card" style={{ padding: "2rem", width: "100%", maxWidth: "400px" }}>
        <h1 className="text-primary" style={{ textAlign: "center", marginBottom: "1.5rem" }}>Login</h1>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
          
          {error && <div style={{ color: "red", fontSize: "0.9rem" }}>{error}</div>}
          
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", padding: "0.75rem" }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
          Don't have an account? <Link href="/register" style={{ color: "var(--primary)" }}>Register here</Link>
        </p>
      </div>
    </main>
  );
}
