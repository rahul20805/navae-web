"use client";

import { useState } from "react";
import { registerUser } from "@/actions/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await registerUser({ name, email, password });
    
    if (res.success) {
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      
      if (signInRes?.error) {
        setError("Account created but failed to login automatically.");
      } else {
        window.location.href = "/account";
      }
    } else {
      setError(res.error || "Failed to register");
    }
    
    setLoading(false);
  };

  return (
    <main className="container" style={{ padding: "5rem 1rem", minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="card" style={{ padding: "2rem", width: "100%", maxWidth: "400px" }}>
        <h1 className="text-primary" style={{ textAlign: "center", marginBottom: "1.5rem" }}>Create Account</h1>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
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
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
      </div>
    </main>
  );
}
