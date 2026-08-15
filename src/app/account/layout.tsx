import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import React from "react";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Protect route
  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  // Optional: Redirect owner back to admin if they shouldn't be here
  // if (session.user.role === "OWNER" || session.user.role === "SUPER_ADMIN") {
  //   redirect("/admin");
  // }

  return (
    <main className="bg-alt" style={{ minHeight: "80vh", paddingTop: "3rem", paddingBottom: "5rem" }}>
      <div className="container">
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", background: "white", padding: "2rem", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
          <div>
            <h1 className="text-primary" style={{ margin: 0 }}>My Account</h1>
            <p className="text-muted" style={{ fontSize: "1.1rem", marginTop: "0.5rem" }}>
              Welcome back, <span style={{ fontWeight: "bold", color: "var(--primary-dark)" }}>{session.user.name || "Guest"}</span>
            </p>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="btn btn-outline" style={{ borderColor: "var(--danger)", color: "var(--danger)" }}>Sign Out</button>
          </form>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "2rem" }}>
          
          {/* Sidebar Navigation */}
          <aside>
            <div className="card" style={{ padding: "1.5rem", position: "sticky", top: "100px" }}>
              <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <Link href="/account" style={{ padding: "0.75rem 1rem", borderRadius: "8px", textDecoration: "none", color: "var(--text-main)", fontWeight: "500", transition: "background 0.2s" }} className="hover-bg-light">
                  Dashboard
                </Link>
                <Link href="/account/orders" style={{ padding: "0.75rem 1rem", borderRadius: "8px", textDecoration: "none", color: "var(--text-main)", fontWeight: "500", transition: "background 0.2s" }} className="hover-bg-light">
                  Order History
                </Link>
                <Link href="/account/bookings" style={{ padding: "0.75rem 1rem", borderRadius: "8px", textDecoration: "none", color: "var(--text-main)", fontWeight: "500", transition: "background 0.2s" }} className="hover-bg-light">
                  My Bookings
                </Link>
                <Link href="/account/settings" style={{ padding: "0.75rem 1rem", borderRadius: "8px", textDecoration: "none", color: "var(--text-main)", fontWeight: "500", transition: "background 0.2s" }} className="hover-bg-light">
                  Profile Settings
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
