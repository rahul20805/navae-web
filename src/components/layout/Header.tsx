"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import styles from "./Header.module.css";
import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/store/useCartStore";

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/custom-gift", label: "Custom Gifts" },
    { href: "/services", label: "Services" },
    { href: "/classes", label: "Classes" },
    { href: "/gallery", label: "Gallery" },
  ];

  const isOwner = session?.user?.role === "OWNER" || session?.user?.role === "SUPER_ADMIN";
  const isAuthenticated = status === "authenticated" && !!session?.user;
  const isLoading = status === "loading";

  return (
    <header
      className={`${styles.header} ${isScrolled ? "glass" : ""}`}
      style={{ position: "sticky", top: 0, zIndex: 100, transition: "all 0.3s ease" }}
    >
      <div className={`container ${styles.headerContainer}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo} style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/images/logo.jpg"
            alt="ANANTA"
            style={{ height: "48px", width: "auto", maxWidth: "180px", objectFit: "contain", borderRadius: "4px" }}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.desktopNav}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? styles.navLinkActive : styles.navLink}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className={styles.actions} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Cart Icon */}
          <Link href="/cart" className={styles.iconBtn} aria-label="Cart" style={{ position: "relative" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <CartCount />
          </Link>

          {/* Auth Buttons */}
          {isLoading ? (
            <div style={{ width: "80px", height: "36px", background: "var(--bg-alt)", borderRadius: "8px", animation: "pulse 1.5s infinite" }} />
          ) : isAuthenticated ? (
            // ---- LOGGED IN ----
            isOwner ? (
              // Owner: just one dashboard button
              <Link href="/admin" className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
                Owner Dashboard
              </Link>
            ) : (
              // Customer: My Account dropdown with Logout
              <div ref={userMenuRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="btn btn-outline"
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span style={{ maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {session.user.name?.split(" ")[0] || "My Account"}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div style={{
                    position: "absolute", right: 0, top: "calc(100% + 8px)",
                    background: "var(--bg-surface)", border: "1px solid var(--border-color)",
                    borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    minWidth: "200px", zIndex: 200, overflow: "hidden"
                  }}>
                    <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-color)", background: "var(--bg-alt)" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--primary-dark)" }}>{session.user.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>{session.user.email}</div>
                    </div>
                    {[
                      { href: "/account", label: "Dashboard", icon: "🏠" },
                      { href: "/account/orders", label: "My Orders", icon: "📦" },
                      { href: "/account/bookings", label: "My Bookings", icon: "🗓️" },
                      { href: "/account/custom-gifts", label: "Custom Gifts", icon: "🎁" },
                      { href: "/account/settings", label: "Profile Settings", icon: "⚙️" },
                    ].map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setUserMenuOpen(false)}
                        style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1.25rem", textDecoration: "none", color: "var(--text-main)", fontSize: "0.9rem", transition: "background 0.15s" }}
                        className="hover-bg-light"
                      >
                        <span>{item.icon}</span> {item.label}
                      </Link>
                    ))}
                    <div style={{ borderTop: "1px solid var(--border-color)" }}>
                      <button
                        onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                        style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%", padding: "0.75rem 1.25rem", background: "none", border: "none", cursor: "pointer", color: "#dc3545", fontSize: "0.9rem", textAlign: "left" }}
                        className="hover-bg-light"
                      >
                        <span>🚪</span> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          ) : (
            // ---- LOGGED OUT: Login | Register ----
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Link
                href="/login"
                className="btn btn-outline"
                style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="btn btn-primary"
                style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function CartCount() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  const count = items.reduce((total, item) => total + item.quantity, 0);
  if (count === 0) return null;
  return (
    <span style={{
      position: "absolute", top: "-8px", right: "-8px",
      backgroundColor: "var(--primary)", color: "white",
      fontSize: "0.7rem", fontWeight: "bold",
      width: "18px", height: "18px", borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
    }}>
      {count > 9 ? "9+" : count}
    </span>
  );
}
