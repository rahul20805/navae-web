"use client";

import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createRazorpayOrder } from "@/actions/payments";
import { createOrder } from "@/actions/shop";
import { validateCoupon } from "@/actions/checkout";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();

  const [couponCode, setCouponCode] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const subtotal = getTotal();
  const finalTotal = subtotal - discountAmount;

  // Re-validate or drop coupon if cart total changes
  useEffect(() => {
    if (appliedCoupon) {
      if (appliedCoupon.minOrderValue && subtotal < appliedCoupon.minOrderValue) {
        handleRemoveCoupon();
        setCouponError(`Coupon removed: Minimum order value of ₹${appliedCoupon.minOrderValue} is no longer met.`);
      } else {
        // Recalculate discount based on new subtotal
        let newDiscount = 0;
        if (appliedCoupon.discountType === "FIXED") {
          newDiscount = appliedCoupon.discountValue;
        } else {
          newDiscount = (subtotal * appliedCoupon.discountValue) / 100;
        }
        if (appliedCoupon.maxDiscount && newDiscount > appliedCoupon.maxDiscount) {
          newDiscount = appliedCoupon.maxDiscount;
        }
        setDiscountAmount(Math.min(newDiscount, subtotal));
      }
    }
  }, [subtotal, appliedCoupon]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponError("");

    const res = await validateCoupon(couponCode, subtotal);
    setValidatingCoupon(false);

    if (res.valid) {
      setAppliedCoupon(res.coupon);
      setDiscountAmount(res.discountAmount || 0);
      setCouponCode(""); // Clear input
    } else {
      setCouponError(res.error || "Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponError("");
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    
    try {
      const orderRes = await createRazorpayOrder(finalTotal);
      
      if (!orderRes.success) {
        alert(orderRes.error || "Payment failed to initialize");
        setIsCheckingOut(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummy",
        amount: orderRes.amount!,
        currency: orderRes.currency!,
        name: "ANANTA",
        description: "Purchase from ANANTA Shop",
        order_id: orderRes.orderId!.startsWith("dummy") ? "" : orderRes.orderId!,
        handler: async function (response: any) {
          const dbRes = await createOrder({
            items,
            totalAmount: finalTotal,
            originalAmount: subtotal,
            discountAmount: discountAmount,
            couponId: appliedCoupon?.id,
            shippingAddress: "To be filled", 
            billingAddress: "To be filled",
          });
          
          if (dbRes.success) {
            clearCart();
            alert("Payment successful! Your order has been placed.");
            router.push("/account");
          } else {
            alert("Payment succeeded but order creation failed. Please contact support.");
          }
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
        },
        theme: {
          color: "#9C4B3C",
        },
      };

      if (orderRes.orderId!.startsWith("dummy")) {
        alert("Running in test mode. Creating order directly...");
        options.handler({ razorpay_payment_id: "pay_dummy_123" });
      } else {
        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          alert("Payment failed: " + response.error.description);
        });
        rzp.open();
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong during checkout.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="container" style={{ padding: "4rem 1.5rem", minHeight: "70vh" }}>
      <h1 className="text-primary" style={{ marginBottom: "2rem" }}>Your Shopping Cart</h1>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 0", background: "var(--bg-surface)", borderRadius: "var(--radius-lg)" }}>
          <h2>Your cart is empty</h2>
          <p className="text-muted" style={{ marginBottom: "2rem" }}>Looks like you haven't added anything yet.</p>
          <Link href="/shop" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", alignItems: "start" }}>
          <div style={{ display: "grid", gap: "1rem" }}>
            {items.map((item) => (
              <div key={item.id} className="card" style={{ display: "flex", gap: "1.5rem", padding: "1.5rem", alignItems: "center" }}>
                <div style={{ width: "80px", height: "80px", backgroundColor: "var(--bg-alt)", borderRadius: "var(--radius-sm)", overflow: "hidden", flexShrink: 0 }}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", color: "#999" }}>No Img</div>
                  )}
                </div>
                <div style={{ flexGrow: 1 }}>
                  <h3 style={{ fontSize: "1.2rem", marginBottom: "0.25rem" }}>
                    <Link href={`/shop/${item.id}`}>{item.name}</Link>
                  </h3>
                  <div style={{ color: "var(--primary)", fontWeight: "bold" }}>₹{item.price.toFixed(2)}</div>
                  {item.customization && (
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                      Customized Item
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: "30px", height: "30px", border: "1px solid #ccc", background: "transparent", borderRadius: "4px", cursor: "pointer" }}>-</button>
                  <span style={{ minWidth: "20px", textAlign: "center", fontWeight: "bold" }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: "30px", height: "30px", border: "1px solid #ccc", background: "transparent", borderRadius: "4px", cursor: "pointer" }}>+</button>
                </div>
                <div>
                  <button onClick={() => removeItem(item.id)} style={{ color: "red", background: "transparent", border: "none", cursor: "pointer", fontSize: "1.2rem" }} aria-label="Remove item">×</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gap: "2rem" }}>
            {/* Promo Code Section */}
            <div className="card" style={{ padding: "1.5rem" }}>
              <h3 style={{ marginBottom: "1rem" }}>Promo Code</h3>
              
              {!appliedCoupon ? (
                <div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="Enter coupon code" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    />
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: "0.5rem 1.5rem" }}
                      onClick={handleApplyCoupon}
                      disabled={validatingCoupon || !couponCode}
                    >
                      {validatingCoupon ? "..." : "Apply"}
                    </button>
                  </div>
                  {couponError && <p style={{ color: "#dc3545", fontSize: "0.9rem", marginTop: "0.5rem" }}>{couponError}</p>}
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fff9", border: "1px dashed #28a745", padding: "1rem", borderRadius: "var(--radius-sm)" }}>
                  <div>
                    <span style={{ fontWeight: "bold", color: "#28a745", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      ✓ {appliedCoupon.code}
                    </span>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Coupon applied successfully</span>
                  </div>
                  <button onClick={handleRemoveCoupon} style={{ color: "#dc3545", background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem", textDecoration: "underline" }}>
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Summary Section */}
            <div className="card" style={{ padding: "2rem", position: "sticky", top: "100px" }}>
              <h2 style={{ marginBottom: "1.5rem" }}>Order Summary</h2>
              
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: "1.1rem" }}>
                <span className="text-muted">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              
              {appliedCoupon && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: "1.1rem", color: "#28a745" }}>
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>- ₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: "1.1rem" }}>
                <span className="text-muted">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              
              <hr style={{ border: "none", borderTop: "1px solid rgba(0,0,0,0.1)", margin: "1.5rem 0" }} />
              
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem", fontSize: "1.25rem", fontWeight: "bold" }}>
                <span>Total</span>
                <span style={{ color: "var(--primary)" }}>₹{finalTotal.toFixed(2)}</span>
              </div>

              <Link 
                href="/checkout" 
                className="btn btn-primary" 
                style={{ display: "block", width: "100%", padding: "1rem", fontSize: "1.1rem", textAlign: "center" }} 
              >
                Proceed to Checkout • ₹{finalTotal.toFixed(2)}
              </Link>
              
              <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "1rem" }}>
                Secure Checkout powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
