"use client";

import { useState } from "react";
import Image from "next/image";

type GalleryImage = {
  id: string;
  url: string;
  title: string | null;
  category: string | null;
};

export default function MasonryLightbox({ images }: { images: GalleryImage[] }) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="text-center" style={{ padding: "5rem 0" }}>
        <h2>The gallery is currently empty.</h2>
        <p className="text-muted">Check back soon for new photos!</p>
      </div>
    );
  }

  return (
    <>
      <div style={{
        columnCount: 1,
        columnGap: "1rem"
      }}>
        <style>{`
          @media (min-width: 640px) { div { column-count: 2 !important; } }
          @media (min-width: 1024px) { div { column-count: 3 !important; } }
        `}</style>
        
        {images.map((img) => (
          <div 
            key={img.id} 
            style={{ 
              marginBottom: "1rem", 
              breakInside: "avoid", 
              position: "relative",
              cursor: "pointer",
              borderRadius: "var(--radius-md)",
              overflow: "hidden"
            }}
            onClick={() => setSelectedImage(img)}
            className="gallery-item"
          >
            {/* We don't know dimensions, so we use next/image with layout fill and object-fit OR regular img tag to preserve aspect ratio in masonry */}
            <img 
              src={img.url} 
              alt={img.title || "Gallery image"} 
              style={{ width: "100%", height: "auto", display: "block", borderRadius: "var(--radius-md)" }}
              loading="lazy"
            />
            
            <div className="gallery-overlay">
              <span>{img.title || (img.category ? `Category: ${img.category}` : "View Image")}</span>
            </div>
            
            <style>{`
              .gallery-overlay {
                position: absolute;
                inset: 0;
                background: rgba(0,0,0,0.4);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity var(--transition-fast);
                font-weight: 500;
              }
              .gallery-item:hover .gallery-overlay {
                opacity: 1;
              }
            `}</style>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem"
          }}
          onClick={() => setSelectedImage(null)}
        >
          <button 
            style={{ position: "absolute", top: "1.5rem", right: "2rem", color: "white", fontSize: "2rem", background: "none", border: "none", cursor: "pointer" }}
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
          >
            ×
          </button>
          
          <img 
            src={selectedImage.url} 
            alt={selectedImage.title || "Fullscreen"} 
            style={{ maxWidth: "100%", maxHeight: "85vh", objectFit: "contain", borderRadius: "4px" }} 
            onClick={(e) => e.stopPropagation()}
          />
          
          {selectedImage.title && (
            <div style={{ color: "white", marginTop: "1rem", fontSize: "1.2rem" }}>
              {selectedImage.title}
            </div>
          )}
        </div>
      )}
    </>
  );
}
