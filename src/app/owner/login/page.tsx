"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function OwnerLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Hardcode email to ensure only owner can attempt this route
    const email = "admin@ananta.in";

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid credentials");
      setLoading(false);
    } else {
      window.location.href = "/admin";
    }
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-main)" }}>
      <div style={{ padding: "3rem", width: "100%", maxWidth: "400px", background: "white", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)", border: "2px solid var(--border-color)" }}>
        
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
          <div style={{ height: "60px", width: "180px", position: "relative" }}>
            <Image src="/images/logo.jpg" alt="ANANTA Logo" fill style={{ objectFit: "contain" }} />
          </div>
        </div>

        <h1 style={{ textAlign: "center", marginBottom: "0.5rem", color: "var(--primary-dark)", fontSize: "1.5rem" }}>Owner Login</h1>
        <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "2rem", fontSize: "0.9rem" }}>Restricted access. Authorized personnel only.</p>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.9rem" }}>Email</label>
            <input 
              type="email" 
              value="admin@ananta.in" 
              disabled 
              style={{ width: "100%", padding: "0.85rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", background: "var(--bg-alt)", color: "var(--text-muted)", cursor: "not-allowed" }} 
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.9rem" }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width: "100%", padding: "0.85rem", border: "1px solid var(--primary)", borderRadius: "var(--radius-md)" }} 
              placeholder="••••••••"
            />
          </div>
          
          {error && <div style={{ color: "white", fontSize: "0.9rem", padding: "0.75rem", background: "var(--error)", borderRadius: "var(--radius-sm)", textAlign: "center", fontWeight: 500 }}>{error}</div>}
          
          <button type="submit" disabled={loading} style={{ width: "100%", padding: "1rem", marginTop: "1rem", background: "var(--primary-dark)", color: "white", border: "none", borderRadius: "var(--radius-md)", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s" }}>
            {loading ? "Authenticating..." : "Sign In as Owner"}
          </button>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <a href="/" style={{ fontSize: "0.85rem", color: "var(--text-muted)", textDecoration: "none" }}>← Return to Public Site</a>
        </div>
      </div>
    </main>
  );
}
