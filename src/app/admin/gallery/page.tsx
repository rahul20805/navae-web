"use client";

import { useState, useEffect } from "react";
import { getGallery, addGalleryItem, deleteGalleryItem } from "@/actions/gallery";
import ImageUpload from "@/components/admin/ImageUpload";

export default function GalleryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({ imageUrl: "", caption: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getGallery();
    setItems(data);
    setLoading(false);
  }

  const handleOpenModal = () => {
    setFormData({ imageUrl: "", caption: "" });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      alert("Please upload an image first.");
      return;
    }
    
    setSaving(true);
    await addGalleryItem(formData);
    setSaving(false);
    handleCloseModal();
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      await deleteGalleryItem(id);
      loadData();
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="text-primary">Gallery Management</h1>
        <button className="btn btn-primary" onClick={handleOpenModal}>+ Add Photo</button>
      </div>

      {loading ? (
        <div>Loading gallery...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
          {items.map((item) => (
            <div key={item.id} className="card" style={{ padding: "0.5rem", position: "relative" }}>
              <img src={item.imageUrl} alt={item.caption} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "4px" }} />
              {item.caption && <div style={{ padding: "0.5rem", fontSize: "0.9rem", textAlign: "center" }}>{item.caption}</div>}
              <button 
                onClick={() => handleDelete(item.id)}
                style={{ position: "absolute", top: "10px", right: "10px", background: "red", color: "white", border: "none", borderRadius: "4px", padding: "0.25rem 0.5rem", cursor: "pointer" }}>
                Delete
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <div style={{ gridColumn: "1 / -1", padding: "2rem", textAlign: "center" }}>No photos in gallery. Upload one!</div>
          )}
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="card" style={{ padding: "2rem", width: "100%", maxWidth: "500px", background: "white", maxHeight: "90vh", overflowY: "auto" }}>
            <h2>Add Photo to Gallery</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>Photo *</label>
                <ImageUpload value={formData.imageUrl} onChange={(url) => setFormData({ ...formData, imageUrl: url as string })} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>Caption (optional)</label>
                <input type="text" value={formData.caption} onChange={(e) => setFormData({ ...formData, caption: e.target.value })} style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }} />
              </div>
              
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" className="btn btn-outline" onClick={handleCloseModal} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving || !formData.imageUrl} style={{ flex: 1 }}>
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
