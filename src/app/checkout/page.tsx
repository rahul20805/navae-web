"use client";

import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createRazorpayOrder } from "@/actions/payments";
import { createOrder } from "@/actions/shop";
import { validateCoupon } from "@/actions/checkout";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    setMounted(true);
    setName(session?.user?.name || "");
    setEmail(session?.user?.email || "");
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { try { document.body.removeChild(script); } catch {} };
  }, [session]);

  if (!mounted) return null;

  const subtotal = getTotal();
  const finalTotal = subtotal - discountAmount;

  if (items.length === 0) {
    return (
      <main className="container" style={{ padding: "4rem 1.5rem", minHeight: "70vh", textAlign: "center" }}>
        <h1>Your cart is empty</h1>
        <p className="text-muted" style={{ marginBottom: "2rem" }}>Add products before checking out.</p>
        <Link href="/shop" className="btn btn-primary">Go to Shop</Link>
      </main>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError("");
    const res = await validateCoupon(couponCode, subtotal);
    if (res.valid) {
      setAppliedCoupon(res.coupon);
      setDiscountAmount(res.discountAmount || 0);
      setCouponCode("");
    } else {
      setCouponError(res.error || "Invalid coupon code");
    }
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) {
      alert("Please enter your shipping address.");
      return;
    }
    setIsProcessing(true);

    try {
      const orderRes = await createRazorpayOrder(finalTotal);
      if (!orderRes.success) {
        alert(orderRes.error || "Payment failed to initialize");
        setIsProcessing(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummy",
        amount: orderRes.amount!,
        currency: orderRes.currency!,
        name: "ANANTA",
        description: "Purchase from ANANTA Shop",
        order_id: orderRes.orderId!.startsWith("dummy") ? "" : orderRes.orderId!,
        prefill: { name, email, contact: phone },
        theme: { color: "#9C4B3C" },
        handler: async function (response: any) {
          const dbRes = await createOrder({
            items,
            totalAmount: finalTotal,
            originalAmount: subtotal,
            discountAmount,
            couponId: appliedCoupon?.id,
            shippingAddress,
            billingAddress: shippingAddress,
          });
          if (dbRes.success) {
            clearCart();
            router.push("/account/orders?success=1");
          } else {
            alert("Payment succeeded but order creation failed. Contact support.");
          }
        },
      };

      if (orderRes.orderId!.startsWith("dummy")) {
        // Test mode - create order directly
        const dbRes = await createOrder({
          items, totalAmount: finalTotal, originalAmount: subtotal,
          discountAmount, couponId: appliedCoupon?.id, shippingAddress, billingAddress: shippingAddress,
        });
        if (dbRes.success) {
          clearCart();
          router.push("/account/orders?success=1");
        } else {
          alert("Order creation failed: " + dbRes.error);
        }
      } else {
        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", (r: any) => alert("Payment failed: " + r.error.description));
        rzp.open();
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="container" style={{ padding: "3rem 1.5rem", minHeight: "70vh" }}>
      <h1 className="text-primary" style={{ marginBottom: "2rem" }}>Checkout</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "2rem", alignItems: "start" }}>
        
        {/* Left: Shipping Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div className="card" style={{ padding: "2rem" }}>
            <h2 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Contact Information</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.9rem" }}>Full Name</label>
                <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.9rem" }}>Phone</label>
                <input type="tel" className="input-field" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" />
              </div>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, fontSize: "0.9rem" }}>Email</label>
              <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
            </div>
          </div>

          <div className="card" style={{ padding: "2rem" }}>
            <h2 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Shipping Address</h2>
            <textarea
              className="input-field"
              rows={4}
              value={shippingAddress}
              onChange={e => setShippingAddress(e.target.value)}
              placeholder="House/Flat No., Street, Area, City, State, PIN Code"
              required
            />
          </div>

          {/* Order Items */}
          <div className="card" style={{ padding: "2rem" }}>
            <h2 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Your Items ({items.length})</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {items.map(item => (
                <div key={item.id} style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "0.75rem", background: "var(--bg-alt)", borderRadius: "8px" }}>
                  {item.image && <img src={item.image} alt={item.name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }} />}
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontWeight: "600" }}>{item.name}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Qty: {item.quantity} × ₹{item.price.toFixed(2)}</div>
                  </div>
                  <div style={{ fontWeight: "bold", color: "var(--primary-dark)" }}>₹{(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="card" style={{ padding: "2rem", position: "sticky", top: "100px" }}>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Order Summary</h2>
          
          {/* Coupon */}
          {!appliedCoupon ? (
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input type="text" className="input-field" placeholder="Coupon code" value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === "Enter" && handleApplyCoupon()}
                  style={{ flexGrow: 1 }} />
                <button className="btn btn-secondary" onClick={handleApplyCoupon} style={{ padding: "0.5rem 1rem", whiteSpace: "nowrap" }}>Apply</button>
              </div>
              {couponError && <p style={{ color: "#dc3545", fontSize: "0.85rem", marginTop: "0.5rem" }}>{couponError}</p>}
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 1rem", background: "#f8fff9", border: "1px dashed #28a745", borderRadius: "8px", marginBottom: "1.5rem" }}>
              <span style={{ color: "#28a745", fontWeight: "bold" }}>✓ {appliedCoupon.code}</span>
              <button onClick={() => { setAppliedCoupon(null); setDiscountAmount(0); }} style={{ color: "#dc3545", background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem" }}>Remove</button>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="text-muted">Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", color: "#28a745" }}>
                <span>Discount</span>
                <span>- ₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="text-muted">Shipping</span>
              <span style={{ color: "#28a745", fontWeight: "600" }}>Free</span>
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "2px solid var(--border-color)", margin: "1rem 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: "bold", marginBottom: "2rem" }}>
            <span>Total</span>
            <span style={{ color: "var(--primary)" }}>₹{finalTotal.toFixed(2)}</span>
          </div>

          <button
            className="btn btn-primary"
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            style={{ width: "100%", padding: "1.1rem", fontSize: "1.1rem", opacity: isProcessing ? 0.7 : 1 }}
          >
            {isProcessing ? "Processing..." : `Place Order • ₹${finalTotal.toFixed(2)}`}
          </button>

          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>🔒 Secure checkout</span>
          </div>

          <Link href="/cart" style={{ display: "block", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "1rem", textDecoration: "none" }}>
            ← Back to Cart
          </Link>
        </div>
      </div>
    </main>
  );
}
