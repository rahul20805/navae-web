"use client";

import { useEffect, useState } from "react";
import { getSettings, saveSettings } from "@/actions/settings";
import ImageUpload from "@/components/admin/ImageUpload";

export default function ContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [content, setContent] = useState({
    heroTitle: "Premium Art & Craft Supplies",
    heroSubtitle: "Handmade gifts and workshops tailored for you.",
    heroImage: "",
    aboutText: "Welcome to NAVAÉ, your premium destination for everything art and craft.",
    announcementBar: "Free shipping on orders over ₹999!",
  });

  useEffect(() => {
    async function load() {
      const data = await getSettings();
      setContent((prev) => ({ ...prev, ...data }));
      setLoading(false);
    }
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContent({ ...content, [e.target.name]: e.target.value });
  };

  const handleImageChange = (url: string | string[]) => {
    setContent({ ...content, heroImage: url as string });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    const res = await saveSettings(content);
    if (res.success) {
      setMessage({ type: "success", text: "Website content saved successfully!" });
    } else {
      setMessage({ type: "error", text: res.error || "Failed to save." });
    }
    
    setSaving(false);
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  if (loading) return <div>Loading website content...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="text-primary">Website Content</h1>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save Content"}
        </button>
      </div>

      {message.text && (
        <div style={{ padding: "1rem", marginBottom: "1rem", borderRadius: "4px", background: message.type === "success" ? "#d4edda" : "#f8d7da", color: message.type === "success" ? "#155724" : "#721c24" }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "2rem" }}>
        
        {/* Announcement Bar */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3>Top Announcement Bar</h3>
          <div style={{ marginTop: "1rem" }}>
            <input type="text" name="announcementBar" value={content.announcementBar} onChange={handleChange} style={{ width: "100%", padding: "0.5rem" }} placeholder="e.g. Free shipping on orders over ₹999!" />
          </div>
        </div>

        {/* Homepage Hero */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3>Homepage Hero Banner</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Hero Title</label>
              <input type="text" name="heroTitle" value={content.heroTitle} onChange={handleChange} style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} />
              
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Hero Subtitle</label>
              <textarea name="heroSubtitle" value={content.heroSubtitle} onChange={handleChange} style={{ width: "100%", padding: "0.5rem", minHeight: "80px" }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Hero Background Image</label>
              <ImageUpload value={content.heroImage} onChange={handleImageChange} />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3>About Us Text</h3>
          <div style={{ marginTop: "1rem" }}>
            <textarea name="aboutText" value={content.aboutText} onChange={handleChange} style={{ width: "100%", padding: "0.5rem", minHeight: "150px" }} />
          </div>
        </div>

      </form>
    </div>
  );
}
