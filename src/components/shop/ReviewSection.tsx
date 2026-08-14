"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewSection({ productId, reviews = [] }: { productId: string, reviews: any[] }) {
  const router = useRouter();
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, author, text, rating }),
      });

      if (res.ok) {
        setSubmitted(true);
        setAuthor("");
        setText("");
        setRating(5);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="reviews" style={{ marginTop: "4rem", paddingTop: "3rem", borderTop: "1px solid #eaeaea" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Customer Reviews</h2>
          <p className="text-muted">{reviews.length} approved review{reviews.length !== 1 ? 's' : ''}</p>
        </div>
        
        <div style={{ display: "flex", gap: "0.5rem", fontSize: "1.2rem", color: "var(--primary)" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>★</span>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        {/* Write Review Form */}
        <div className="card" style={{ padding: "2rem", background: "var(--bg-alt)" }}>
          <h3 style={{ marginBottom: "1.5rem" }}>Write a Review</h3>
          
          {submitted ? (
            <div style={{ padding: "1rem", background: "#e8f5e9", color: "#2e7d32", borderRadius: "var(--radius-sm)" }}>
              Thank you! Your review has been submitted and is pending approval.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Your Name</label>
                <input 
                  type="text" 
                  value={author} 
                  onChange={(e) => setAuthor(e.target.value)} 
                  required 
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }} 
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Rating</label>
                <select 
                  value={rating} 
                  onChange={(e) => setRating(Number(e.target.value))}
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px" }} 
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Good</option>
                  <option value={2}>2 Stars - Fair</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Your Experience</label>
                <textarea 
                  value={text} 
                  onChange={(e) => setText(e.target.value)} 
                  required 
                  rows={4}
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "4px", resize: "vertical" }} 
                ></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
        </div>

        {/* Reviews List */}
        <div>
          {reviews.length === 0 ? (
            <div style={{ padding: "3rem 0", textAlign: "center", color: "var(--text-muted)", border: "1px dashed #ddd", borderRadius: "var(--radius-md)" }}>
              Be the first to review this product!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {reviews.map(review => (
                <div key={review.id} style={{ borderBottom: "1px solid #eee", paddingBottom: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <strong style={{ fontSize: "1.1rem" }}>{review.author}</strong>
                    <div style={{ color: "var(--primary)" }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} style={{ color: i < review.rating ? "var(--primary)" : "#ddd" }}>★</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                    {new Date(review.createdAt).toLocaleDateString('en-IN')}
                  </div>
                  <p style={{ lineHeight: 1.6, margin: 0 }}>{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
