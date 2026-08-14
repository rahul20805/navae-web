"use client";

import { useEffect, useState } from "react";
import { getSettings, saveSettings } from "@/actions/settings";
import ImageUpload from "@/components/admin/ImageUpload";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [settings, setSettings] = useState({
    businessName: "",
    logoUrl: "",
    whatsappNumber: "",
    instagramUrl: "",
    emailAddress: "",
    physicalAddress: "",
    openingHours: "",
    shippingPolicy: "",
    returnPolicy: "",
    seoTitle: "",
    seoDescription: "",
  });

  useEffect(() => {
    async function load() {
      const data = await getSettings();
      setSettings((prev) => ({ ...prev, ...data }));
      setLoading(false);
    }
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (url: string | string[]) => {
    setSettings({ ...settings, logoUrl: url as string });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    const res = await saveSettings(settings);
    if (res.success) {
      setMessage({ type: "success", text: "Settings saved successfully!" });
    } else {
      setMessage({ type: "error", text: res.error || "Failed to save." });
    }
    
    setSaving(false);
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="text-primary">Owner Settings</h1>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save All Settings"}
        </button>
      </div>

      {message.text && (
        <div style={{ padding: "1rem", marginBottom: "1rem", borderRadius: "4px", background: message.type === "success" ? "#d4edda" : "#f8d7da", color: message.type === "success" ? "#155724" : "#721c24" }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "2rem", gridTemplateColumns: "1fr 1fr" }}>
        
        {/* Basic Info */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3>Business Identity</h3>
          <div style={{ marginTop: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Business Name</label>
            <input type="text" name="businessName" value={settings.businessName} onChange={handleChange} style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Logo</label>
            <ImageUpload value={settings.logoUrl} onChange={handleLogoChange} />
          </div>
        </div>

        {/* Contact Info */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3>Contact Details</h3>
          <div style={{ marginTop: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>WhatsApp Number (incl. country code)</label>
            <input type="text" name="whatsappNumber" value={settings.whatsappNumber} onChange={handleChange} style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} placeholder="+91..." />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Instagram URL</label>
            <input type="text" name="instagramUrl" value={settings.instagramUrl} onChange={handleChange} style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Support Email</label>
            <input type="email" name="emailAddress" value={settings.emailAddress} onChange={handleChange} style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} />
          </div>
        </div>

        {/* Store Policies */}
        <div className="card" style={{ padding: "1.5rem", gridColumn: "1 / -1" }}>
          <h3>Store Policies & Details</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Physical Address</label>
              <textarea name="physicalAddress" value={settings.physicalAddress} onChange={handleChange} style={{ width: "100%", padding: "0.5rem", minHeight: "100px" }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Opening Hours</label>
              <textarea name="openingHours" value={settings.openingHours} onChange={handleChange} style={{ width: "100%", padding: "0.5rem", minHeight: "100px" }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Shipping Policy</label>
              <textarea name="shippingPolicy" value={settings.shippingPolicy} onChange={handleChange} style={{ width: "100%", padding: "0.5rem", minHeight: "100px" }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>Return / Refund Policy</label>
              <textarea name="returnPolicy" value={settings.returnPolicy} onChange={handleChange} style={{ width: "100%", padding: "0.5rem", minHeight: "100px" }} />
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="card" style={{ padding: "1.5rem", gridColumn: "1 / -1" }}>
          <h3>SEO & Metadata</h3>
          <div style={{ marginTop: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Global SEO Title</label>
            <input type="text" name="seoTitle" value={settings.seoTitle} onChange={handleChange} style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Global SEO Description</label>
            <textarea name="seoDescription" value={settings.seoDescription} onChange={handleChange} style={{ width: "100%", padding: "0.5rem", minHeight: "80px" }} />
          </div>
        </div>

      </form>
    </div>
  );
}
