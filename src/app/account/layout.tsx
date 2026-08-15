import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import React from "react";
import AccountSignOut from "./AccountSignOut";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Protect route - unauthenticated users go to login
  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  // Owner/Admin accounts belong in the Admin Dashboard, not the customer portal
  const role = session.user.role as string | undefined;
  if (role === "OWNER" || role === "SUPER_ADMIN") {
    redirect("/admin");
  }

  // Fetch the real name from DB (not just the session cache)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });

  const displayName = user?.name || session.user.name || session.user.email || "My Account";

  return (
    <main className="bg-alt" style={{ minHeight: "80vh", paddingTop: "3rem", paddingBottom: "5rem" }}>
      <div className="container">
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", background: "white", padding: "2rem", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
          <div>
            <h1 className="text-primary" style={{ margin: 0 }}>My Account</h1>
            <p className="text-muted" style={{ fontSize: "1.1rem", marginTop: "0.5rem" }}>
              Welcome back, <span style={{ fontWeight: "bold", color: "var(--primary-dark)" }}>{displayName}</span>
            </p>
          </div>
          <AccountSignOut />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "2rem" }}>
          
          {/* Sidebar Navigation */}
          <aside>
            <div className="card" style={{ padding: "1.5rem", position: "sticky", top: "100px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", marginBottom: "0.5rem", background: "var(--bg-alt)", borderRadius: "8px" }}>
                <div style={{
                  width: "38px", height: "38px", borderRadius: "50%",
                  background: "var(--primary)", color: "white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: "bold", fontSize: "1rem", flexShrink: 0
                }}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{displayName}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{user?.email || session.user.email}</div>
                </div>
              </div>

              <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <Link href="/account" style={{ padding: "0.75rem 1rem", borderRadius: "8px", textDecoration: "none", color: "var(--text-main)", fontWeight: "500", transition: "background 0.2s" }} className="hover-bg-light">
                  🏠 Dashboard
                </Link>
                <Link href="/account/orders" style={{ padding: "0.75rem 1rem", borderRadius: "8px", textDecoration: "none", color: "var(--text-main)", fontWeight: "500", transition: "background 0.2s" }} className="hover-bg-light">
                  📦 Order History
                </Link>
                <Link href="/account/bookings" style={{ padding: "0.75rem 1rem", borderRadius: "8px", textDecoration: "none", color: "var(--text-main)", fontWeight: "500", transition: "background 0.2s" }} className="hover-bg-light">
                  🗓️ My Bookings
                </Link>
                <Link href="/account/custom-gifts" style={{ padding: "0.75rem 1rem", borderRadius: "8px", textDecoration: "none", color: "var(--text-main)", fontWeight: "500", transition: "background 0.2s" }} className="hover-bg-light">
                  🎁 Custom Gift Requests
                </Link>
                <Link href="/account/settings" style={{ padding: "0.75rem 1rem", borderRadius: "8px", textDecoration: "none", color: "var(--text-main)", fontWeight: "500", transition: "background 0.2s" }} className="hover-bg-light">
                  ⚙️ Profile Settings
                </Link>
              </nav>
            </div>
          </aside>

          {/* Page Content */}
          <section>
            {children}
          </section>

        </div>
      </div>
    </main>
  );
}
