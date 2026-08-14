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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert("Please login to book a class");
      router.push("/login");
      return;
    }

    setLoading(true);
    setMessage("");

    const res = await createBooking({
      classId,
      date: new Date(date),
      notes,
    });

    setLoading(false);

    if (res.success) {
      setMessage("Booking request sent successfully! We will contact you soon.");
      setDate("");
      setNotes("");
    } else {
      setMessage(res.error || "Failed to submit booking");
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
