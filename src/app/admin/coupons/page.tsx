"use client";

import { useState, useEffect } from "react";
import { getCoupons, createCoupon, updateCoupon, toggleCouponStatus, deleteCoupon } from "@/actions/coupons";

export default function CouponsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    discountType: "PERCENTAGE", // or FIXED
    discountValue: 10,
    minOrderValue: 0,
    maxDiscount: 0,
    validFrom: "",
    validUntil: "",
    usageLimit: 0,
    isActive: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getCoupons();
    setItems(data);
    setLoading(false);
  }

  const handleOpenModal = (item?: any) => {
    setErrorMsg("");
    if (item) {
      setEditingId(item.id);
      setFormData({
        code: item.code,
        discountType: item.discountType,
        discountValue: item.discountValue,
        minOrderValue: item.minOrderValue || 0,
        maxDiscount: item.maxDiscount || 0,
        validFrom: item.validFrom ? new Date(item.validFrom).toISOString().split('T')[0] : "",
        validUntil: item.validUntil ? new Date(item.validUntil).toISOString().split('T')[0] : "",
        usageLimit: item.usageLimit || 0,
        isActive: item.isActive,
      });
    } else {
      setEditingId(null);
      setFormData({
        code: "",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderValue: 0,
        maxDiscount: 0,
        validFrom: "",
        validUntil: "",
        usageLimit: 0,
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    const payload = {
      ...formData,
      discountValue: Number(formData.discountValue),
      minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : null,
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
      validFrom: formData.validFrom ? new Date(formData.validFrom) : null,
      validUntil: formData.validUntil ? new Date(formData.validUntil) : null,
    };

    let res;
    if (editingId) {
      res = await updateCoupon(editingId, payload);
    } else {
      res = await createCoupon(payload);
    }

    setSaving(false);

    if (res.success) {
      setShowModal(false);
      loadData();
    } else {
      setErrorMsg(res.error || "Failed to save coupon");
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    await toggleCouponStatus(id, isActive);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this coupon?")) {
      await deleteCoupon(id);
      loadData();
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="text-primary">Promo Codes & Coupons</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>+ Add Coupon</button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="card" style={{ overflowX: "auto", padding: "1rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                <th style={{ padding: "1rem" }}>Code</th>
                <th style={{ padding: "1rem" }}>Discount</th>
                <th style={{ padding: "1rem" }}>Usage</th>
                <th style={{ padding: "1rem" }}>Validity</th>
                <th style={{ padding: "1rem" }}>Status</th>
                <th style={{ padding: "1rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "1rem", fontWeight: "bold" }}>{item.code}</td>
                  <td style={{ padding: "1rem" }}>
                    {item.discountType === "PERCENTAGE" ? `${item.discountValue}% OFF` : `₹${item.discountValue} OFF`}
                    {item.minOrderValue > 0 && <div style={{ fontSize: "0.8rem", color: "#666" }}>Min order: ₹{item.minOrderValue}</div>}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {item.usedCount} {item.usageLimit ? `/ ${item.usageLimit}` : "uses"}
                  </td>
                  <td style={{ padding: "1rem", fontSize: "0.9rem" }}>
                    {item.validFrom ? new Date(item.validFrom).toLocaleDateString() : "Always"} - {item.validUntil ? new Date(item.validUntil).toLocaleDateString() : "Forever"}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", background: item.isActive ? "#d4edda" : "#f8d7da", color: item.isActive ? "#155724" : "#721c24", fontSize: "0.85rem" }}>
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", display: "flex", gap: "0.5rem" }}>
                    <button className="btn btn-outline" style={{ padding: "0.25rem 0.75rem" }} onClick={() => handleToggle(item.id, !item.isActive)}>
                      {item.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button className="btn btn-outline" style={{ padding: "0.25rem 0.75rem" }} onClick={() => handleOpenModal(item)}>Edit</button>
                    <button className="btn btn-primary" style={{ padding: "0.25rem 0.75rem", background: "red" }} onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "2rem", textAlign: "center" }}>No coupons created yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="card" style={{ padding: "2rem", width: "100%", maxWidth: "600px", background: "white", maxHeight: "90vh", overflowY: "auto" }}>
            <h2>{editingId ? "Edit Coupon" : "Create Coupon"}</h2>
            
            {errorMsg && (
              <div style={{ padding: "1rem", background: "#f8d7da", color: "#721c24", borderRadius: "4px", margin: "1rem 0" }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>Coupon Code *</label>
                <input required type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="e.g. WELCOME10" style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>Discount Type *</label>
                  <select value={formData.discountType} onChange={(e) => setFormData({ ...formData, discountType: e.target.value })} style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }}>
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>Discount Value *</label>
                  <input required type="number" step="0.01" min="0" value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })} style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>Minimum Order Value (₹)</label>
                  <input type="number" min="0" value={formData.minOrderValue} onChange={(e) => setFormData({ ...formData, minOrderValue: parseFloat(e.target.value) })} style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }} />
                  <small style={{ color: "#666" }}>0 or blank for no minimum.</small>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>Max Discount Limit (₹)</label>
                  <input type="number" min="0" value={formData.maxDiscount} onChange={(e) => setFormData({ ...formData, maxDiscount: parseFloat(e.target.value) })} style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }} disabled={formData.discountType === "FIXED"} />
                  <small style={{ color: "#666" }}>Only applies to Percentage type.</small>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>Valid From</label>
                  <input type="date" value={formData.validFrom} onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })} style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>Valid Until</label>
                  <input type="date" value={formData.validUntil} onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })} style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>Total Usage Limit</label>
                <input type="number" min="0" value={formData.usageLimit} onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })} style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }} />
                <small style={{ color: "#666" }}>0 or blank for unlimited usage.</small>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} style={{ width: "20px", height: "20px" }} />
                <label htmlFor="isActive" style={{ fontWeight: "500" }}>Coupon is Active</label>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1 }}>
                  {saving ? "Saving..." : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
