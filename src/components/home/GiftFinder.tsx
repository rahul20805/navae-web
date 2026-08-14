"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GiftFinder() {
  const router = useRouter();
  const [occasion, setOccasion] = useState("");
  const [recipient, setRecipient] = useState("");
  const [budget, setBudget] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (occasion) params.append("category", occasion);
    if (recipient) params.append("tag", recipient);
    if (budget) {
      const [min, max] = budget.split("-");
      if (min) params.append("minPrice", min);
      if (max && max !== "+") params.append("maxPrice", max);
    }
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <section style={{ 
      padding: "3rem 1rem", 
      background: "linear-gradient(135deg, var(--bg-alt) 0%, rgba(220,180,180,0.1) 100%)",
      marginTop: "-2rem",
      position: "relative",
      zIndex: 10,
      borderBottom: "1px solid rgba(0,0,0,0.05)"
    }}>
      <div className="container">
        <div className="card" style={{ 
          maxWidth: "900px", 
          margin: "0 auto", 
          padding: "2.5rem", 
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          transform: "translateY(-40px)"
        }}>
          <h2 style={{ textAlign: "center", marginBottom: "0.5rem", color: "var(--primary-dark)" }}>Find the Perfect Gift</h2>
          <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "2rem" }}>Tell us who you're shopping for, and we'll handle the rest.</p>
          
          <form onSubmit={handleSearch} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", alignItems: "end" }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--text-main)" }}>Occasion</label>
              <select 
                value={occasion} 
                onChange={(e) => setOccasion(e.target.value)}
                style={{ padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd", background: "white", outline: "none", fontSize: "1rem" }}
              >
                <option value="">Any Occasion</option>
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="wedding">Marriage & Wedding</option>
                <option value="valentine">Valentine's Day</option>
                <option value="farewell">Farewell</option>
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--text-main)" }}>Recipient</label>
              <select 
                value={recipient} 
                onChange={(e) => setRecipient(e.target.value)}
                style={{ padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd", background: "white", outline: "none", fontSize: "1rem" }}
              >
                <option value="">Anyone</option>
                <option value="girlfriend">Girlfriend</option>
                <option value="boyfriend">Boyfriend</option>
                <option value="couple">Couple</option>
                <option value="wife">Wife</option>
                <option value="husband">Husband</option>
                <option value="friend">Friend</option>
                <option value="parents">Parents</option>
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--text-main)" }}>Budget (₹)</label>
              <select 
                value={budget} 
                onChange={(e) => setBudget(e.target.value)}
                style={{ padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd", background: "white", outline: "none", fontSize: "1rem" }}
              >
                <option value="">Any Budget</option>
                <option value="0-500">Under ₹500</option>
                <option value="500-1000">₹500 - ₹1000</option>
                <option value="1000-2500">₹1000 - ₹2500</option>
                <option value="2500-+">Above ₹2500</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: "0.8rem", height: "50px", fontSize: "1rem", fontWeight: "bold" }}>
              Show Gifts
            </button>
            
          </form>
        </div>
      </div>
    </section>
  );
}
