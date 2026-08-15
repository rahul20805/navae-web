import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import AIGallery from "@/components/home/AIGallery";
import Image from "next/image";

export default async function AdminDashboardPage() {
  const session = await auth();
  const ownerName = session?.user?.name || "Owner";

  const productsCount = await prisma.product.count();
  const classesCount = await prisma.class.count();
  const ordersCount = await prisma.order.count();
  const bookingsCount = await prisma.booking.count();
  const enquiriesCount = await prisma.enquiry.count();

  return (
    <div>
      <div style={{ position: "relative", width: "100%", height: "200px", borderRadius: "12px", overflow: "hidden", marginBottom: "2rem" }}>
        <Image src="/images/hero_banner.jpg" alt="ANANTA Admin Banner" fill style={{ objectFit: "cover" }} priority />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", padding: "2rem" }}>
          <div>
            <h1 style={{ color: "white", margin: 0, textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>Welcome, {ownerName}</h1>
            <p style={{ color: "rgba(255,255,255,0.85)", margin: "0.5rem 0 0", fontSize: "1rem" }}>Here's what's happening with ANANTA today</p>
          </div>
        </div>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        
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

      <div className="card" style={{ padding: "1.5rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Gallery Preview</h2>
        <AIGallery />
      </div>
    </div>
  );
}
