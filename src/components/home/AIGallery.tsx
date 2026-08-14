"use client";

import Image from "next/image";
import { useRef } from "react";

const images = [
  { src: "/images/gallery_1.jpg", alt: "Handmade Scrapbook", title: "Handmade Scrapbooks" },
  { src: "/images/gallery_2.jpg", alt: "Resin Art Clock", title: "Resin Art" },
  { src: "/images/gallery_3.jpg", alt: "Personalized Gift Box", title: "Custom Hampers" },
];

export default function AIGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", margin: "2rem 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.8rem", color: "var(--primary-dark)" }}>Featured Creations</h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={() => scroll('left')} className="btn btn-outline" style={{ padding: "0.5rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button onClick={() => scroll('right')} className="btn btn-outline" style={{ padding: "0.5rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        style={{ 
          display: "flex", 
          gap: "1.5rem", 
          overflowX: "auto", 
          scrollbarWidth: "none", 
          msOverflowStyle: "none",
          paddingBottom: "1rem"
        }}
      >
        {images.map((img, i) => (
          <div key={i} style={{ minWidth: "300px", flex: "0 0 80%", maxWidth: "450px", position: "relative", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", aspectRatio: "4/3" }}>
            <Image 
              src={img.src} 
              alt={img.alt} 
              fill 
              style={{ objectFit: "cover" }} 
            />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", padding: "1.5rem 1rem 1rem 1rem", color: "white" }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 500 }}>{img.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
