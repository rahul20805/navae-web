"use client";

import { useState, useEffect } from "react";
import { getCustomers } from "@/actions/customers";
import Link from "next/link";

export default function CustomersPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering and Sorting
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("date_desc");

  useEffect(() => {
    loadData();
  }, [search, roleFilter]);

  async function loadData() {
    setLoading(true);
    // Add debounce in a real app, but for now we just load
    const data = await getCustomers(search, roleFilter);
    setItems(data);
    setLoading(false);
  }

  // Client-side sorting
  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === "date_desc") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "date_asc") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === "spent_desc") return b.totalSpent - a.totalSpent;
    if (sortBy === "orders_desc") return b._count.orders - a._count.orders;
    return 0;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="text-primary">Customer Management</h1>
      </div>

      <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <input 
          type="text" 
          placeholder="Search name, email, phone..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "0.75rem", border: "1px solid #ddd", borderRadius: "8px", flex: "1", minWidth: "250px" }}
        />
        
        <select 
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ padding: "0.75rem", border: "1px solid #ddd", borderRadius: "8px", background: "white" }}
        >
          <option value="ALL">All Roles</option>
          <option value="USER">Customer (USER)</option>
          <option value="OWNER">Owner / Admin</option>
        </select>

        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: "0.75rem", border: "1px solid #ddd", borderRadius: "8px", background: "white" }}
        >
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="spent_desc">Highest Spending</option>
          <option value="orders_desc">Most Orders</option>
        </select>
      </div>

      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "#666" }}>Loading customers...</div>
      ) : (
        <div className="card" style={{ padding: "1rem", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                <th style={{ padding: "1rem" }}>Customer</th>
                <th style={{ padding: "1rem" }}>Role</th>
                <th style={{ padding: "1rem" }}>Total Orders</th>
                <th style={{ padding: "1rem" }}>Total Spent</th>
                <th style={{ padding: "1rem" }}>Joined Date</th>
                <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: "600", color: "var(--primary-dark)" }}>{item.name || "Unknown"}</div>
                    <div style={{ fontSize: "0.85rem", color: "#666" }}>{item.email}</div>
                    {item.phone && <div style={{ fontSize: "0.8rem", color: "#888" }}>{item.phone}</div>}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ 
                      padding: "0.25rem 0.6rem", 
                      borderRadius: "20px", 
                      background: item.role === "OWNER" || item.role === "SUPER_ADMIN" ? "#ffebee" : "#e8f5e9",
                      color: item.role === "OWNER" || item.role === "SUPER_ADMIN" ? "#c62828" : "#2e7d32", 
                      fontSize: "0.8rem",
                      fontWeight: "600"
                    }}>
                      {item.role}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: "500" }}>{item._count?.orders || 0}</div>
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>{item._count?.bookings || 0} Bookings</div>
                  </td>
                  <td style={{ padding: "1rem", fontWeight: "600", color: "var(--primary)" }}>
                    ₹{item.totalSpent.toFixed(2)}
                  </td>
                  <td style={{ padding: "1rem", fontSize: "0.9rem" }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <Link href={`/admin/customers/${item.id}`} style={{ 
                      display: "inline-block",
                      padding: "0.5rem 1rem", 
                      background: "var(--primary)", 
                      color: "white", 
                      textDecoration: "none",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontWeight: "500"
                    }}>
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
              {sortedItems.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "#666" }}>
                    No customers found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
