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
      <section className="section">
        <div className="container">
          <h2 className="text-center" style={{ marginBottom: "2rem" }}>{title}</h2>
          <div className="text-center" style={{ padding: "3rem", background: "var(--bg-surface)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--text-muted)" }}>
            <p style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>New creations are coming soon.</p>
            <Link href="/shop?custom=true" className="btn btn-outline" style={{ marginTop: "1rem" }}>Request a Custom Creation</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2>{title}</h2>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={() => scroll("left")} className="btn-circle" aria-label="Scroll left">←</button>
            <button onClick={() => scroll("right")} className="btn-circle" aria-label="Scroll right">→</button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          style={{
            display: "flex",
            gap: "1.5rem",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none",  // IE and Edge
            paddingBottom: "1rem"
          }}
          className="hide-scrollbar"
        >
          {products.map((product) => (
            <div 
              key={product.id} 
              className="card" 
              style={{ 
                minWidth: "280px", 
                maxWidth: "320px", 
                flex: "0 0 auto", 
                scrollSnapAlign: "start",
                display: "flex",
                flexDirection: "column",
                padding: "1rem"
              }}
            >
              <Link href={`/shop/${product.slug}`} style={{ flex: 1 }}>
                <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: "1rem", backgroundColor: "#f0f0f0" }}>
                  {product.images?.[0] ? (
                    <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>No image</div>
                  )}
                  
                  {product.customization && (
                    <span style={{ position: "absolute", top: "0.5rem", left: "0.5rem", background: "var(--primary)", color: "white", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold" }}>
                      Customizable
                    </span>
                  )}
                </div>
                
                <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</h4>
                
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--primary)" }}>
                    ₹{product.discountPrice || product.price}
                  </span>
                  {product.discountPrice && (
                    <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", textDecoration: "line-through" }}>
                      ₹{product.price}
                    </span>
                  )}
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
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--bg-surface);
            border: 1px solid var(--text-muted);
            color: var(--text-main);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            transition: all var(--transition-fast);
          }
          .btn-circle:hover {
            background: var(--primary);
            color: white;
            border-color: var(--primary);
          }
        `}</style>
      </div>
    </section>
  );
}
