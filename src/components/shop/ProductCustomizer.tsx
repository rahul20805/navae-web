"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";

type ProductData = {
  id: string;
  name: string;
  price: number;
  discountPrice: number | null;
  image: string;
  customization: boolean;
};

export default function ProductCustomizer({ product }: { product: ProductData }) {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [customDetails, setCustomDetails] = useState({
    name: "",
    date: "",
    message: "",
    instructions: ""
  });
  const [added, setAdded] = useState(false);

  const priceToUse = product.discountPrice || product.price;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: priceToUse,
      quantity,
      image: product.image,
      customization: product.customization ? JSON.stringify(customDetails) : undefined
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsApp = () => {
    let msg = `Hi! I'm interested in the ${product.name} (₹${priceToUse}).\n\n`;
    if (product.customization) {
      msg += `Customization Details:\n`;
      if (customDetails.name) msg += `- Name: ${customDetails.name}\n`;
      if (customDetails.date) msg += `- Date: ${customDetails.date}\n`;
      if (customDetails.message) msg += `- Message: ${customDetails.message}\n`;
      if (customDetails.instructions) msg += `- Instructions: ${customDetails.instructions}\n`;
    }
    const url = `https://wa.me/917379609531?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      {product.customization && (
        <div style={{ background: "var(--bg-alt)", padding: "1.5rem", borderRadius: "var(--radius-md)", marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "var(--primary-dark)" }}>Customize Your Gift</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.9rem", marginBottom: "0.25rem", color: "var(--text-muted)" }}>Name(s) to include</label>
              <input type="text" className="input-field" value={customDetails.name} onChange={(e) => setCustomDetails({...customDetails, name: e.target.value})} placeholder="e.g. Rahul & Neha" />
            </div>
            
            <div>
              <label style={{ display: "block", fontSize: "0.9rem", marginBottom: "0.25rem", color: "var(--text-muted)" }}>Special Date</label>
              <input type="date" className="input-field" value={customDetails.date} onChange={(e) => setCustomDetails({...customDetails, date: e.target.value})} />
            </div>
            
            <div>
              <label style={{ display: "block", fontSize: "0.9rem", marginBottom: "0.25rem", color: "var(--text-muted)" }}>Personal Message / Quote</label>
              <textarea className="input-field" value={customDetails.message} onChange={(e) => setCustomDetails({...customDetails, message: e.target.value})} placeholder="Write a short message..." rows={2}></textarea>
            </div>
            
            <div>
              <label style={{ display: "block", fontSize: "0.9rem", marginBottom: "0.25rem", color: "var(--text-muted)" }}>Additional Instructions & Theme</label>
              <textarea className="input-field" value={customDetails.instructions} onChange={(e) => setCustomDetails({...customDetails, instructions: e.target.value})} placeholder="Colors, themes, or special requests..." rows={3}></textarea>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <span style={{ fontWeight: 500 }}>Quantity:</span>
        <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: "0.5rem 1rem", background: "var(--bg-surface)", borderRight: "1px solid #ddd" }}>-</button>
          <span style={{ padding: "0.5rem 1rem", background: "var(--bg-surface)", minWidth: "3rem", textAlign: "center" }}>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} style={{ padding: "0.5rem 1rem", background: "var(--bg-surface)", borderLeft: "1px solid #ddd" }}>+</button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <button 
          onClick={handleAddToCart}
          className="btn btn-primary"
          style={{ width: "100%", padding: "1rem", fontSize: "1.1rem" }}
        >
          {added ? "Added to Cart ✓" : "Add to Cart"}
        </button>
        
        <button 
          onClick={handleWhatsApp}
          className="btn btn-outline"
          style={{ width: "100%", padding: "1rem", fontSize: "1.1rem", borderColor: "#25D366", color: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
          Enquire on WhatsApp
        </button>
      </div>
    </div>
  );
}
