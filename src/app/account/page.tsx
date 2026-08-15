import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | My Account | ANANTA",
};

export default async function AccountDashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 3
      },
      bookings: {
        orderBy: { date: 'desc' },
        take: 3,
        include: { class: true }
      }
    }
  });

  if (!user) return null;

  const validOrders = user.orders.filter(o => !["CANCELLED", "REFUNDED"].includes(o.status));
  const totalSpent = validOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* Overview Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
        <div className="card" style={{ padding: "1.5rem", background: "var(--primary)", color: "white" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem", fontWeight: "500", opacity: 0.9 }}>Total Spent</h3>
          <div style={{ fontSize: "2rem", fontWeight: "700" }}>₹{totalSpent.toFixed(2)}</div>
        </div>
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem", fontWeight: "500", color: "var(--text-muted)" }}>Total Orders</h3>
          <div style={{ fontSize: "2rem", fontWeight: "700", color: "var(--primary-dark)" }}>{user.orders.length}</div>
        </div>
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem", fontWeight: "500", color: "var(--text-muted)" }}>Active Bookings</h3>
          <div style={{ fontSize: "2rem", fontWeight: "700", color: "var(--primary-dark)" }}>{user.bookings.length}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Recent Orders */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.2rem", margin: 0, color: "var(--text-main)" }}>Recent Orders</h2>
            <Link href="/account/orders" style={{ fontSize: "0.9rem", color: "var(--primary)", textDecoration: "none", fontWeight: "600" }}>View All →</Link>
          </div>
          
          {user.orders.length === 0 ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>No recent orders.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {user.orders.map((order) => (
                <div key={order.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "1rem", borderBottom: "1px solid #eee" }}>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>Order #{order.id.slice(-8).toUpperCase()}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: "700", color: "var(--primary-dark)" }}>₹{order.totalAmount.toFixed(2)}</div>
                    <div style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", background: "#f0f0f0", borderRadius: "4px", display: "inline-block", marginTop: "0.2rem" }}>{order.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.2rem", margin: 0, color: "var(--text-main)" }}>Recent Bookings</h2>
            <Link href="/account/bookings" style={{ fontSize: "0.9rem", color: "var(--primary)", textDecoration: "none", fontWeight: "600" }}>View All →</Link>
          </div>
          
          {user.bookings.length === 0 ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>No upcoming bookings.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {user.bookings.map((booking) => (
                <div key={booking.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "1rem", borderBottom: "1px solid #eee" }}>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>{booking.class?.title || "Class"}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{new Date(booking.date).toLocaleDateString()}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", background: booking.status === "CONFIRMED" ? "#e8f5e9" : "#fff3e0", color: booking.status === "CONFIRMED" ? "#2e7d32" : "#e65100", borderRadius: "4px", display: "inline-block", fontWeight: "600" }}>
                      {booking.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
