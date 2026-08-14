"use client";

import { useState, useEffect } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import ImageUpload from "@/components/admin/ImageUpload";

export default function ProductsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ 
    name: "", description: "", price: "", discountPrice: "", stock: "1", 
    images: [] as string[], categoryId: "", isAvailable: true, isPublished: true, customization: false, variants: "" 
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
    setItems(prods);
    setCategories(cats);
    setLoading(false);
  }

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditId(item.id);
      setFormData({ 
        name: item.name, 
        description: item.description || "", 
        price: String(item.price), 
        discountPrice: item.discountPrice ? String(item.discountPrice) : "",
        stock: String(item.stock),
        images: item.images || [],
        categoryId: item.categoryId || "",
        isAvailable: item.isAvailable,
        isPublished: item.isPublished,
        customization: item.customization,
        variants: item.variants ? JSON.stringify(item.variants) : ""
      });
    } else {
      setEditId(null);
      setFormData({ 
        name: "", description: "", price: "", discountPrice: "", stock: "1", 
        images: [], categoryId: "", isAvailable: true, isPublished: true, customization: false, variants: "" 
      });
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
      await updateProduct(editId, formData);
    } else {
      await createProduct(formData);
    }
    
    setSaving(false);
    handleCloseModal();
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      loadData();
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="text-primary">Inventory / Shop</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>+ Add Product</button>
      </div>

      {loading ? (
        <div>Loading products...</div>
      ) : (
        <div className="card" style={{ padding: "1rem", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                <th style={{ padding: "1rem" }}>Image</th>
                <th style={{ padding: "1rem" }}>Product Name</th>
                <th style={{ padding: "1rem" }}>Price</th>
                <th style={{ padding: "1rem" }}>Stock</th>
                <th style={{ padding: "1rem" }}>Status</th>
                <th style={{ padding: "1rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "1rem" }}>
                    {item.images?.[0] ? <img src={item.images[0]} alt={item.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} /> : "No Image"}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <strong>{item.name}</strong><br/>
                    <small style={{color: "#666"}}>{item.category?.name || "Uncategorized"}</small>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {item.discountPrice ? (
                      <><span style={{ textDecoration: "line-through", color: "#999", marginRight: "0.5rem" }}>₹{item.price}</span>₹{item.discountPrice}</>
                    ) : `₹${item.price}`}
                  </td>
                  <td style={{ padding: "1rem" }}>{item.stock}</td>
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
                  <td colSpan={6} style={{ padding: "2rem", textAlign: "center" }}>No products found in inventory. Create one!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="card" style={{ padding: "2rem", width: "100%", maxWidth: "800px", background: "white", maxHeight: "90vh", overflowY: "auto" }}>
            <h2>{editId ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>Product Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>Category</label>
                  <select value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }}>
                    <option value="">-- Select Category --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px", minHeight: "80px" }} />
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>Regular Price (₹) *</label>
                  <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>Discount Price (₹)</label>
                  <input type="number" step="0.01" value={formData.discountPrice} onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })} style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>Stock Quantity *</label>
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>Product Images</label>
                <ImageUpload multiple={true} value={formData.images} onChange={(urls) => setFormData({ ...formData, images: urls as string[] })} />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>Variants (JSON Format - e.g. [{`"name":"Size","options":["S","M"]`}])</label>
                <input type="text" value={formData.variants} onChange={(e) => setFormData({ ...formData, variants: e.target.value })} style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }} />
              </div>

              <div style={{ display: "flex", gap: "2rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} />
                  Publish to Shop
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input type="checkbox" checked={formData.customization} onChange={(e) => setFormData({ ...formData, customization: e.target.checked })} />
                  Allow Customization Requests
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
