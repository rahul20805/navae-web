"use client";

import { useState, useEffect } from "react";
import { getCustomers } from "@/actions/customers";

export default function CustomersPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getCustomers();
    setItems(data);
    setLoading(false);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="text-primary">Customers Database</h1>
      </div>

      {loading ? (
        <div>Loading customers...</div>
      ) : (
        <div className="card" style={{ padding: "1rem", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                <th style={{ padding: "1rem" }}>Name</th>
                <th style={{ padding: "1rem" }}>Email</th>
                <th style={{ padding: "1rem" }}>Role</th>
                <th style={{ padding: "1rem" }}>Total Orders</th>
                <th style={{ padding: "1rem" }}>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "1rem" }}><strong>{item.name || "Unknown"}</strong></td>
                  <td style={{ padding: "1rem" }}>{item.email}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", background: item.role === "SUPER_ADMIN" ? "#cce5ff" : "#e2e3e5", fontSize: "0.85rem" }}>
                      {item.role}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>{item._count?.orders || 0}</td>
                  <td style={{ padding: "1rem" }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "2rem", textAlign: "center" }}>No registered customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
