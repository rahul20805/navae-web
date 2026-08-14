import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const productsCount = await prisma.product.count();
  const classesCount = await prisma.class.count();
  const ordersCount = await prisma.order.count();
  const bookingsCount = await prisma.booking.count();
  const enquiriesCount = await prisma.enquiry.count();

  return (
    <div>
      <h1 className="text-primary" style={{ marginBottom: "2rem" }}>Dashboard Overview</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
        
        <div className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
          <h3 style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: "0.5rem" }}>Total Products</h3>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--primary)" }}>{productsCount}</div>
        </div>

        <div className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
          <h3 style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: "0.5rem" }}>Active Classes</h3>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--primary)" }}>{classesCount}</div>
        </div>

        <div className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
          <h3 style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: "0.5rem" }}>Shop Orders</h3>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--primary)" }}>{ordersCount}</div>
        </div>

        <div className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
          <h3 style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: "0.5rem" }}>Class Bookings</h3>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--primary)" }}>{bookingsCount}</div>
        </div>

        <div className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
          <h3 style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: "0.5rem" }}>New Enquiries</h3>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--primary)" }}>{enquiriesCount}</div>
        </div>

      </div>
    </div>
  );
}
