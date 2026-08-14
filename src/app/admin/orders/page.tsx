import { prisma } from "@/lib/prisma";
import styles from "../admin.module.css";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      items: {
        include: { product: true }
      }
    }
  });

  return (
    <div>
      <h1 className="text-primary" style={{ marginBottom: "2rem" }}>Shop Orders</h1>

      <div style={{ overflowX: "auto" }}>
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>No orders yet.</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontSize: "0.85rem", fontFamily: "monospace" }}>{order.id}</td>
                  <td>
                    <div>{order.user?.name || "Guest"}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{order.user?.email || ""}</div>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    {order.items.map(i => (
                      <div key={i.id} style={{ fontSize: "0.85rem" }}>{i.quantity}x {i.product.name}</div>
                    ))}
                  </td>
                  <td style={{ fontWeight: "bold" }}>₹{order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.85rem", backgroundColor: "var(--bg-alt)" }}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
