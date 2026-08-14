"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";

export default function ProductCarousel({ title, products }: { title: string, products: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="container">
        <h2 className="text-center" style={{ marginBottom: "2rem", color: "var(--primary)" }}>{title}</h2>
        <div className="text-center" style={{ padding: "3rem", background: "var(--bg-surface)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-color)" }}>
          <p style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>New creations are coming soon.</p>
          <Link href="/custom-gift" className="btn btn-secondary" style={{ marginTop: "1.5rem", borderColor: "var(--primary)", color: "var(--primary)" }}>Request a Custom Creation</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <h2 style={{ color: "var(--primary)", margin: 0 }}>{title}</h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={() => scroll("left")} className="btn-circle" aria-label="Scroll left">←</button>
          <button onClick={() => scroll("right")} className="btn-circle" aria-label="Scroll right">→</button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        style={{
          display: "flex",
          gap: "2rem",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none",  // IE and Edge
          paddingBottom: "2rem"
        }}
        className="hide-scrollbar"
      >
        {products.map((product) => (
          <div 
            key={product.id} 
            className="product-card" 
            style={{ 
              minWidth: "300px", 
              maxWidth: "300px", 
              flex: "0 0 auto", 
              scrollSnapAlign: "start",
              display: "flex",
              flexDirection: "column",
              background: "var(--bg-surface)",
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
              boxShadow: "var(--shadow-sm)",
              transition: "all var(--transition-normal)",
              border: "1px solid var(--border-color)",
              position: "relative"
            }}
          >
            {/* Wishlist Icon */}
            <button className="wishlist-btn" aria-label="Add to wishlist" style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 10, background: "white", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-sm)", border: "none", cursor: "pointer", color: "var(--text-muted)", transition: "all var(--transition-fast)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>

            <Link href={`/shop/${product.slug}`} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ position: "relative", width: "100%", aspectRatio: "4/5", overflow: "hidden", backgroundColor: "var(--bg-alt)" }}>
                {product.images?.[0] ? (
                  <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: "cover", transition: "transform 0.5s ease" }} className="product-image" />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>No image</div>
                )}
                
                {product.customization && (
                  <span style={{ position: "absolute", top: "1rem", left: "1rem", background: "var(--secondary)", color: "white", padding: "0.25rem 0.75rem", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                    Customizable
                  </span>
                )}
                
                {/* Quick View Hover State */}
                <div className="quick-view-overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity var(--transition-normal)" }}>
                  <span style={{ background: "white", color: "var(--primary-dark)", padding: "0.5rem 1.5rem", borderRadius: "var(--radius-full)", fontWeight: 500, fontSize: "0.9rem" }}>Quick View</span>
                </div>
              </div>
              
              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
                <h4 style={{ fontSize: "1.15rem", marginBottom: "0.5rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 500, color: "var(--text-main)" }}>{product.name}</h4>
                
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1.5rem", flex: 1 }}>
                  <span style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--primary-dark)" }}>
                    ₹{product.discountPrice || product.price}
                  </span>
                  {product.discountPrice && (
                    <span style={{ fontSize: "0.95rem", color: "var(--text-muted)", textDecoration: "line-through" }}>
                      ₹{product.price}
                    </span>
                  )}
                </div>

                <button className="btn btn-secondary" style={{ width: "100%", padding: "0.75rem", fontSize: "0.95rem", borderRadius: "var(--radius-md)", borderColor: "var(--primary)", color: "var(--primary)", fontWeight: 500 }} onClick={(e) => { e.preventDefault(); /* Add to cart logic here */ }}>
                  Add to Cart
                </button>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .btn-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: all var(--transition-fast);
          cursor: pointer;
        }
        .btn-circle:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
        }
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        .product-card:hover .quick-view-overlay {
          opacity: 1;
        }
        .wishlist-btn:hover {
          color: var(--secondary) !important;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
