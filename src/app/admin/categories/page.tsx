"use client";

import { useState, useEffect } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/actions/categories";
import ImageUpload from "@/components/admin/ImageUpload";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ name: "", description: "", image: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getCategories();
    setCategories(data);
    setLoading(false);
  }

  const handleOpenModal = (cat?: any) => {
    if (cat) {
      setEditId(cat.id);
      setFormData({ name: cat.name, description: cat.description || "", image: cat.image || "" });
    } else {
      setEditId(null);
      setFormData({ name: "", description: "", image: "" });
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
      await updateCategory(editId, formData);
    } else {
      await createCategory(formData);
    }
    
    setSaving(false);
    handleCloseModal();
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id);
      loadData();
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="text-primary">Gift Categories</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>+ Add Category</button>
      </div>

      {loading ? (
        <div>Loading categories...</div>
      ) : (
        <div className="card" style={{ padding: "1rem", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                <th style={{ padding: "1rem" }}>Image</th>
                <th style={{ padding: "1rem" }}>Name</th>
                <th style={{ padding: "1rem" }}>Slug</th>
                <th style={{ padding: "1rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "1rem" }}>
                    {cat.image ? <img src={cat.image} alt={cat.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} /> : "No Image"}
                  </td>
                  <td style={{ padding: "1rem" }}><strong>{cat.name}</strong></td>
                  <td style={{ padding: "1rem", color: "#666" }}>{cat.slug}</td>
                  <td style={{ padding: "1rem", display: "flex", gap: "0.5rem" }}>
                    <button className="btn btn-outline" style={{ padding: "0.25rem 0.75rem" }} onClick={() => handleOpenModal(cat)}>Edit</button>
                    <button className="btn btn-primary" style={{ padding: "0.25rem 0.75rem", background: "red" }} onClick={() => handleDelete(cat.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: "2rem", textAlign: "center" }}>No categories found. Create one!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="card" style={{ padding: "2rem", width: "100%", maxWidth: "500px", background: "white", maxHeight: "90vh", overflowY: "auto" }}>
            <h2>{editId ? "Edit Category" : "Add Category"}</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px", minHeight: "80px" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>Image</label>
                <ImageUpload value={formData.image} onChange={(url) => setFormData({ ...formData, image: url as string })} />
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
