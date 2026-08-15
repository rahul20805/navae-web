import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order History | My Account | ANANTA",
};

export default async function AccountOrdersPage() {
  const session = await auth();
  if (!session?.user) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: true } } }
      }
    }
  });

  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "#28a745";
      case "SHIPPED": return "#17a2b8";
      case "PROCESSING": return "#ffc107";
      case "CANCELLED": return "#dc3545";
      default: return "#6c757d"; // PENDING
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case "DELIVERED": return 100;
      case "SHIPPED": return 75;
      case "PROCESSING": return 40;
      case "PENDING": return 10;
      case "CANCELLED": return 0;
      default: return 0;
    }
  };

  return (
    <div className="card" style={{ padding: "2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
      <h2 style={{ marginBottom: "2rem", borderBottom: "2px solid #f0f0f0", paddingBottom: "1rem", color: "var(--text-main)" }}>Order History</h2>
      
      {user.orders.length === 0 ? (
        <div className="text-center" style={{ padding: "3rem 0", background: "var(--bg-alt)", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛍️</div>
          <p className="text-muted" style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>You haven't placed any orders yet.</p>
          <Link href="/shop" className="btn btn-primary" style={{ padding: "0.8rem 2rem" }}>Explore Shop</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {user.orders.map((order: any) => (
            <div key={order.id} style={{ border: "1px solid #eaeaea", borderRadius: "var(--radius-md)", padding: "1.5rem", background: "white" }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Order #{order.id.substring(0,8)}
                  </div>
                  <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--primary)" }}>
                    ₹{order.totalAmount.toFixed(2)}
                  </div>
                  <div style={{ display: "inline-block", padding: "0.35rem 1rem", borderRadius: "2rem", fontSize: "0.8rem", fontWeight: "bold", color: "white", backgroundColor: getStatusColor(order.status), marginTop: "0.5rem" }}>
                    {order.status}
                  </div>
                </div>
              </div>

              {order.status !== "CANCELLED" && (
                <div style={{ marginBottom: "2rem", background: "#fafafa", padding: "1rem", borderRadius: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem", fontWeight: 500 }}>
                    <span>Order Placed</span>
                    <span>Processing</span>
                    <span>Shipped</span>
                    <span>Delivered</span>
                  </div>
                  <div style={{ height: "8px", background: "#e9ecef", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${getStatusProgress(order.status)}%`, background: getStatusColor(order.status), transition: "width 1s ease-in-out" }}></div>
                  </div>
                </div>
              )}

              <div style={{ borderTop: "1px solid #eee", paddingTop: "1.5rem" }}>
                <h4 style={{ marginBottom: "1rem", fontSize: "1rem", color: "var(--text-main)" }}>Items in this order:</h4>
                <div style={{ display: "grid", gap: "1rem" }}>
                  {order.items.map((item: any) => (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.5rem", borderRadius: "8px", transition: "background 0.2s" }} className="hover-bg-light">
                      <div style={{ width: "60px", height: "60px", background: "#f0f0f0", borderRadius: "8px", overflow: "hidden" }}>
                        {item.product.images[0] ? (
                          <img src={item.product.images[0]} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : null}
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <Link href={`/shop/${item.product.slug}`} style={{ fontWeight: 600, color: "var(--text-main)", textDecoration: "none" }}>{item.product.name}</Link>
                        <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Qty: {item.quantity} × ₹{item.price.toFixed(2)}</div>
                      </div>
                      {order.status === "DELIVERED" && (
                        <Link href={`/shop/${item.product.slug}#reviews`} className="btn btn-outline" style={{ padding: "0.4rem 1rem", fontSize: "0.85rem", borderRadius: "20px" }}>
                          Write Review
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
