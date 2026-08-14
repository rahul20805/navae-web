"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import styles from "./Header.module.css";
import { useState, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/custom-gift", label: "Custom Gifts" },
    { href: "/services", label: "Services" },
    { href: "/classes", label: "Classes" },
    { href: "/gallery", label: "Gallery" },
  ];

  return (
    <header className={`${styles.header} ${isScrolled ? "glass" : ""}`} style={{ position: "sticky", top: 0, zIndex: 100, transition: "all 0.3s ease" }}>
      <div className={`container ${styles.headerContainer}`}>
        <Link href="/" className={styles.logo} style={{ display: "flex", alignItems: "center" }}>
          <img 
            src="/images/logo.jpg" 
            alt="ANANTA" 
            style={{ 
              height: "48px", 
              width: "auto", 
              maxWidth: "180px", 
              objectFit: "contain", 
              borderRadius: "4px" 
            }} 
          />
        </Link>
        
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

          <div className={styles.actions} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href="/cart" className={styles.iconBtn} aria-label="Cart">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </Link>
            
            {status === "authenticated" && session?.user ? (
              <Link href={session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN" ? "/admin" : "/account"} className="btn btn-outline" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN" ? "Dashboard" : "My Account"}
              </Link>
            ) : (
              <Link href="/login" className="btn btn-outline" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                Login
              </Link>
            )}
          </div>
      </div>
    </header>
  );
}
