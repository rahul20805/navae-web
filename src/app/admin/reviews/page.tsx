"use client";

import { useState, useEffect } from "react";
import { getReviews, toggleReviewVisibility, deleteReview } from "@/actions/reviews";

export default function ReviewsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getReviews();
    setItems(data);
    setLoading(false);
  }

  const handleToggle = async (id: string, isApproved: boolean) => {
    await toggleReviewVisibility(id, isApproved);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this review permanently?")) {
      await deleteReview(id);
      loadData();
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="text-primary">Reviews & Feedback</h1>
      </div>

      {loading ? (
        <div>Loading reviews...</div>
      ) : (
        <div className="card" style={{ padding: "1rem", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                <th style={{ padding: "1rem" }}>Date</th>
                <th style={{ padding: "1rem" }}>User</th>
                <th style={{ padding: "1rem" }}>Product</th>
                <th style={{ padding: "1rem" }}>Rating</th>
                <th style={{ padding: "1rem" }}>Comment</th>
                <th style={{ padding: "1rem" }}>Status</th>
                <th style={{ padding: "1rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "1rem" }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "1rem" }}>{item.author || "Guest"}</td>
                  <td style={{ padding: "1rem" }}>{"Shop Product"}</td>
                  <td style={{ padding: "1rem", color: "#f39c12", fontWeight: "bold" }}>{"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}</td>
                  <td style={{ padding: "1rem", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.text}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", background: item.isApproved ? "#d4edda" : "#f8d7da", color: item.isApproved ? "#155724" : "#721c24", fontSize: "0.85rem" }}>
                      {item.isApproved ? "Approved" : "Hidden"}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", display: "flex", gap: "0.5rem" }}>
                    <button 
                      className="btn btn-outline" 
                      style={{ padding: "0.25rem 0.75rem" }} 
                      onClick={() => handleToggle(item.id, !item.isApproved)}
                    >
                      {item.isApproved ? "Hide" : "Approve"}
                    </button>
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: "0.25rem 0.75rem", background: "red" }} 
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: "2rem", textAlign: "center" }}>No reviews found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
