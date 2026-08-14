"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import styles from "@/app/shop/page.module.css";

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
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    });
    alert(`Added ${quantity} ${product.name}(s) to your cart!`);
  };

  return (
    <div>
      <div className={styles.quantityControl}>
        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className={styles.quantityBtn}>-</button>
        <span style={{ fontSize: "1.2rem", fontWeight: "500", width: "30px", textAlign: "center" }}>{quantity}</span>
        <button onClick={() => setQuantity(quantity + 1)} className={styles.quantityBtn}>+</button>
      </div>
      <button onClick={handleAdd} className="btn btn-primary" style={{ width: "100%", padding: "1rem", fontSize: "1.1rem" }}>
        Add to Cart
      </button>
    </div>
  );
}
