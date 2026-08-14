"use client";

import { useState } from "react";
import { createClass } from "@/actions/admin";
import { useRouter } from "next/navigation";

export default function NewClassPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    await createClass({
      title: formData.get("title") as string,
      instructor: formData.get("instructor") as string,
      schedule: formData.get("schedule") as string,
      duration: formData.get("duration") as string,
      price: parseFloat(formData.get("price") as string),
      maxStudents: parseInt(formData.get("maxStudents") as string),
      imageUrl: formData.get("imageUrl") as string,
    });

    router.push("/admin/classes");
  }

  return (
    <div style={{ maxWidth: "600px" }}>
      <h1 className="text-primary" style={{ marginBottom: "2rem" }}>Schedule New Class</h1>

      <form onSubmit={handleSubmit} className="card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Class Title</label>
          <input type="text" name="title" required style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }} />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Instructor Name</label>
            <input type="text" name="instructor" required style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Schedule (e.g. Saturdays 10 AM)</label>
            <input type="text" name="schedule" required style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Duration (e.g. 2 Hours)</label>
            <input type="text" name="duration" required style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Max Students</label>
            <input type="number" name="maxStudents" min="1" required style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }} />
          </div>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Price (₹)</label>
          <input type="number" name="price" step="0.01" min="0" required style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Image URL</label>
          <input type="url" name="imageUrl" placeholder="https://..." required style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }} />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: "1rem" }}>
          {loading ? "Saving..." : "Schedule Class"}
        </button>

      </form>
    </div>
  );
}
