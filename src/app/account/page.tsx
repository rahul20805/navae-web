import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | ANANTA",
};

export default async function AccountPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: true } } }
      }
    }
  });

  if (!user) {
    redirect("/api/auth/signin");
  }

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
    <main className="bg-alt" style={{ minHeight: "80vh", paddingTop: "3rem", paddingBottom: "5rem" }}>
      <div className="container">
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
          <div>
            <h1 className="text-primary">My Account</h1>
            <p className="text-muted">Welcome back, {user.name || "Guest"}</p>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="btn btn-outline">Sign Out</button>
          </form>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
          <div className="card" style={{ padding: "2rem" }}>
            <h2 style={{ marginBottom: "2rem", borderBottom: "1px solid #eee", paddingBottom: "1rem" }}>My Orders</h2>
            
            {user.orders.length === 0 ? (
              <div className="text-center" style={{ padding: "3rem 0" }}>
                <p className="text-muted" style={{ marginBottom: "1.5rem" }}>You haven't placed any orders yet.</p>
                <Link href="/shop" className="btn btn-primary">Start Shopping</Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {user.orders.map((order) => (
                  <div key={order.id} style={{ border: "1px solid #eaeaea", borderRadius: "var(--radius-md)", padding: "1.5rem" }}>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
                      <div>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                          Order #{order.id.substring(0,8).toUpperCase()}
                        </div>
                        <div style={{ fontWeight: "bold" }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                      
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--primary)" }}>
                          ₹{order.totalAmount.toFixed(2)}
                        </div>
                        <div style={{ display: "inline-block", padding: "0.25rem 0.75rem", borderRadius: "1rem", fontSize: "0.8rem", fontWeight: "bold", color: "white", backgroundColor: getStatusColor(order.status), marginTop: "0.5rem" }}>
                          {order.status}
                        </div>
                      </div>
                    </div>

                    {order.status !== "CANCELLED" && (
                      <div style={{ marginBottom: "2rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                          <span>Order Placed</span>
                          <span>Processing</span>
                          <span>Shipped</span>
                          <span>Delivered</span>
                        </div>
                        <div style={{ height: "6px", background: "#eee", borderRadius: "3px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${getStatusProgress(order.status)}%`, background: getStatusColor(order.status), transition: "width 0.5s ease" }}></div>
                        </div>
                      </div>
                    )}

                    <div style={{ borderTop: "1px solid #eee", paddingTop: "1.5rem" }}>
                      <h4 style={{ marginBottom: "1rem", fontSize: "0.95rem" }}>Items in this order:</h4>
                      <div style={{ display: "grid", gap: "1rem" }}>
                        {order.items.map((item) => (
                          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div style={{ width: "50px", height: "50px", background: "#f0f0f0", borderRadius: "4px", overflow: "hidden" }}>
                              {item.product.images[0] ? (
                                <img src={item.product.images[0]} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : null}
                            </div>
                            <div style={{ flexGrow: 1 }}>
                              <Link href={`/shop/${item.product.slug}`} style={{ fontWeight: 500 }}>{item.product.name}</Link>
                              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Qty: {item.quantity} × ₹{item.price.toFixed(2)}</div>
                            </div>
                            {order.status === "DELIVERED" && (
                              <Link href={`/shop/${item.product.slug}#reviews`} className="btn btn-outline" style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}>
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
        </div>

      </div>
    </main>
  );
}
