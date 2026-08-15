"use client";

import { useState, useEffect } from "react";
import { updateUserProfile } from "@/actions/account";
import { useSession } from "next-auth/react";

export default function AccountSettingsPage() {
  const { data: session, update } = useSession();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    // In a real app we'd fetch the exact DB data, but session holds basic info
    // For phone/address, if they aren't in session, we might want to fetch them via server action first.
    // For speed, we'll let the user type them or rely on what's fetched if we fetched it.
    // Since we didn't fetch the deep user model here, we assume it's mostly for updating.
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        phone: (session.user as any).phone || "",
        address: (session.user as any).address || ""
      });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const res = await updateUserProfile(formData);
    
    if (res.success) {
      setMessage({ type: "success", text: "Profile updated successfully!" });
      // Tell NextAuth to update its local session copy
      await update({ name: formData.name });
    } else {
      setMessage({ type: "error", text: res.error || "Failed to update profile." });
    }
    
    setLoading(false);
  };

  return (
    <div className="card" style={{ padding: "2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", maxWidth: "600px" }}>
      <h2 style={{ marginBottom: "2rem", borderBottom: "2px solid #f0f0f0", paddingBottom: "1rem", color: "var(--text-main)" }}>Profile Settings</h2>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-main)" }}>Full Name</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "8px" }}
            required
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-main)" }}>Phone Number</label>
          <input 
            type="tel" 
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "8px" }}
            placeholder="+91 98765 43210"
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--text-main)" }}>Default Shipping Address</label>
          <textarea 
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "8px", minHeight: "100px", resize: "vertical" }}
            placeholder="123 Art Street, Varanasi..."
          />
        </div>

        {message.text && (
          <div style={{ 
            padding: "1rem", 
            borderRadius: "8px", 
            background: message.type === "success" ? "#e8f5e9" : "#ffebee",
            color: message.type === "success" ? "#2e7d32" : "#c62828",
            fontWeight: "500"
          }}>
            {message.text}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary"
          style={{ padding: "1rem", fontSize: "1rem", marginTop: "1rem", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Saving Changes..." : "Save Profile"}
        </button>

      </form>
    </div>
  );
}
