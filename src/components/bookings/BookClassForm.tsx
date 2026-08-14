"use client";

import { useState } from "react";
import { createBooking } from "@/actions/bookings";
import styles from "@/app/classes/page.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface BookClassFormProps {
  classId: string;
}

export default function BookClassForm({ classId }: BookClassFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load Razorpay script
  useState(() => {
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert("Please login to book a class");
      router.push("/login");
      return;
    }

    setLoading(true);
    setMessage("");

    // Simulate payment process (replace with actual price later)
    try {
      const orderRes = await fetch("/api/payments/create-dummy", { method: "POST" }).catch(() => ({}));
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummy",
        amount: 99900, // Dummy class price: 999 INR
        currency: "INR",
        name: "ANANTA Class Booking",
        description: "Booking Request",
        handler: async function (response: any) {
          const res = await createBooking({
            classId,
            date: new Date(date),
            notes,
          });

          if (res.success) {
            setMessage("Booking payment successful and request sent! We will contact you soon.");
            setDate("");
            setNotes("");
          } else {
            setMessage(res.error || "Payment succeeded but failed to submit booking to DB");
          }
          setLoading(false);
        },
        prefill: {
          name: session.user?.name || "Student",
          email: session.user?.email || "student@example.com",
        },
        theme: { color: "#995b2e" },
      };

      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        alert("Running in test mode. Bypassing payment popup.");
        options.handler({ razorpay_payment_id: "pay_dummy_123" });
      } else {
        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          setMessage("Payment failed: " + response.error.description);
          setLoading(false);
        });
        rzp.open();
      }
    } catch (error) {
      setMessage("An error occurred during booking checkout.");
      setLoading(false);
    }
  };

  return (
    <form className={styles.bookingForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="date">Preferred Date</label>
        <input 
          type="date" 
          id="date" 
          required 
          value={date} 
          onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="notes">Additional Notes</label>
        <textarea 
          id="notes" 
          rows={3} 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any specific requirements or skill level?"
        ></textarea>
      </div>
      
      {message && (
        <div style={{ padding: "1rem", background: message.includes("success") ? "rgba(0,200,0,0.1)" : "rgba(200,0,0,0.1)", color: message.includes("success") ? "green" : "red", borderRadius: "4px" }}>
          {message}
        </div>
      )}

      <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", padding: "1rem" }}>
        {loading ? "Submitting..." : "Request Booking"}
      </button>
      <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", textAlign: "center", marginTop: "0.5rem" }}>
        Pay at studio after confirmation.
      </p>
    </form>
  );
}
