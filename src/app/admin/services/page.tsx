"use client";

import { useState, useEffect } from "react";
import { getServices, createService, updateService, deleteService } from "@/actions/services";
import ImageUpload from "@/components/admin/ImageUpload";

export default function ServicesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ title: "", description: "", image: "", isPublished: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getServices();
    setItems(data);
    setLoading(false);
  }

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditId(item.id);
      setFormData({ title: item.title, description: item.description || "", image: item.image || "", isPublished: item.isPublished });
    } else {
      setEditId(null);
      setFormData({ title: "", description: "", image: "", isPublished: true });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    if (editId) {
      await updateService(editId, formData);
    } else {
      await createService(formData);
    }
    
    setSaving(false);
    handleCloseModal();
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      await deleteService(id);
      loadData();
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="text-primary">Services Management</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>+ Add Service</button>
      </div>

      {loading ? (
        <div>Loading services...</div>
      ) : (
        <div className="card" style={{ padding: "1rem", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                <th style={{ padding: "1rem" }}>Image</th>
                <th style={{ padding: "1rem" }}>Title</th>
                <th style={{ padding: "1rem" }}>Status</th>
                <th style={{ padding: "1rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "1rem" }}>
                    {item.image ? <img src={item.image} alt={item.title} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} /> : "No Image"}
                  </td>
                  <td style={{ padding: "1rem" }}><strong>{item.title}</strong><br/><small style={{color: "#666"}}>{item.slug}</small></td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", background: item.isPublished ? "#d4edda" : "#f8d7da", color: item.isPublished ? "#155724" : "#721c24", fontSize: "0.85rem" }}>
                      {item.isPublished ? "Published" : "Hidden"}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", display: "flex", gap: "0.5rem" }}>
                    <button className="btn btn-outline" style={{ padding: "0.25rem 0.75rem" }} onClick={() => handleOpenModal(item)}>Edit</button>
                    <button className="btn btn-primary" style={{ padding: "0.25rem 0.75rem", background: "red" }} onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: "2rem", textAlign: "center" }}>No services found. Create one!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="card" style={{ padding: "2rem", width: "100%", maxWidth: "500px", background: "white", maxHeight: "90vh", overflowY: "auto" }}>
            <h2>{editId ? "Edit Service" : "Add Service"}</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px", minHeight: "80px" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>Image</label>
                <ImageUpload value={formData.image} onChange={(url) => setFormData({ ...formData, image: url as string })} />
              </div>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} />
                  Publish Service to Website
                </label>
              </div>
              
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" className="btn btn-outline" onClick={handleCloseModal} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1 }}>
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
