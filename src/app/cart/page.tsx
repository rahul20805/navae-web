"use client";

import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration errors with localStorage
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="container" style={{ padding: "4rem 1rem", minHeight: "70vh" }}>
      <h1 className="text-primary" style={{ marginBottom: "2rem" }}>Your Shopping Cart</h1>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 0", background: "var(--bg-surface)", borderRadius: "var(--radius-lg)" }}>
          <h2>Your cart is empty</h2>
          <p className="text-muted" style={{ marginBottom: "2rem" }}>Looks like you haven't added anything yet.</p>
          <Link href="/shop" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", alignItems: "start" }}>
          <div>
            {items.map((item) => (
              <div key={item.id} style={{ display: "flex", gap: "1.5rem", padding: "1.5rem", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", marginBottom: "1rem", alignItems: "center" }}>
                <div style={{ width: "80px", height: "80px", backgroundColor: "var(--bg-alt)", borderRadius: "var(--radius-sm)" }}>
                  {item.image && <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />}
                </div>
                <div style={{ flexGrow: 1 }}>
                  <h3 style={{ fontSize: "1.2rem", marginBottom: "0.25rem" }}>{item.name}</h3>
                  <div style={{ color: "var(--primary)", fontWeight: "bold" }}>₹{item.price.toFixed(2)}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: "0.25rem 0.75rem", border: "1px solid #ccc", background: "transparent", borderRadius: "4px", cursor: "pointer" }}>-</button>
                  <span style={{ minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: "0.25rem 0.75rem", border: "1px solid #ccc", background: "transparent", borderRadius: "4px", cursor: "pointer" }}>+</button>
                </div>
                <div>
                  <button onClick={() => removeItem(item.id)} style={{ color: "red", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "var(--bg-surface)", padding: "2rem", borderRadius: "var(--radius-lg)", position: "sticky", top: "2rem" }}>
            <h2 style={{ marginBottom: "1.5rem" }}>Order Summary</h2>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: "1.1rem" }}>
              <span>Subtotal</span>
              <span>₹{getTotal().toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: "1.1rem" }}>
              <span>Shipping</span>
              <span>Calculated at next step</span>
            </div>
            <hr style={{ border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", margin: "1.5rem 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem", fontSize: "1.25rem", fontWeight: "bold" }}>
              <span>Total</span>
              <span>₹{getTotal().toFixed(2)}</span>
            </div>
            
            <button className="btn btn-primary" style={{ width: "100%", padding: "1rem", fontSize: "1.1rem" }} onClick={() => alert("Checkout flow is under construction!")}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
