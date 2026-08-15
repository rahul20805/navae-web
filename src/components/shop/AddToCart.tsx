"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";

interface AddToCartProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
}

export default function AddToCart({ product }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: "36px", height: "36px", border: "1px solid #ccc", background: "transparent", borderRadius: "6px", cursor: "pointer", fontSize: "1.1rem" }}>-</button>
        <span style={{ fontSize: "1.2rem", fontWeight: "500", width: "30px", textAlign: "center" }}>{quantity}</span>
        <button onClick={() => setQuantity(quantity + 1)} style={{ width: "36px", height: "36px", border: "1px solid #ccc", background: "transparent", borderRadius: "6px", cursor: "pointer", fontSize: "1.1rem" }}>+</button>
      </div>
      <button onClick={handleAdd} className="btn btn-primary" style={{ width: "100%", padding: "1rem", fontSize: "1.1rem" }}>
        {added ? "✓ Added to Cart!" : "Add to Cart"}
      </button>
      {added && (
        <div style={{ marginTop: "1rem", padding: "1rem", background: "#e8f5e9", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#2e7d32", fontWeight: "500" }}>✓ Added to your cart</span>
          <Link href="/cart" className="btn btn-outline" style={{ padding: "0.4rem 1rem", fontSize: "0.85rem", borderColor: "#2e7d32", color: "#2e7d32" }}>View Cart →</Link>
        </div>
      )}
    </div>
  );
}
