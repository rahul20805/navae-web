"use client";

import { useState } from "react";
import { createProduct } from "@/actions/admin";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    await createProduct({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      stock: parseInt(formData.get("stock") as string),
      imageUrl: formData.get("imageUrl") as string,
    });

    router.push("/admin/products");
  }

  return (
    <div style={{ maxWidth: "600px" }}>
      <h1 className="text-primary" style={{ marginBottom: "2rem" }}>Add New Product</h1>

      <form onSubmit={handleSubmit} className="card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Product Name</label>
          <input type="text" name="name" required style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Description</label>
          <textarea name="description" rows={4} required style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }}></textarea>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Price (₹)</label>
            <input type="number" name="price" step="0.01" min="0" required style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Stock Quantity</label>
            <input type="number" name="stock" min="0" required style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }} />
          </div>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Image URL</label>
          <input type="url" name="imageUrl" placeholder="https://..." required style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }} />
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>Paste a direct link to an image (e.g. from Imgur, Unsplash, or your cloud storage).</p>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: "1rem" }}>
          {loading ? "Saving..." : "Save Product"}
        </button>

      </form>
    </div>
  );
}
