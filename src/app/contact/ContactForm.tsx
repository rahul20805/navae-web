"use client";

import { useState } from "react";
import { submitEnquiry } from "@/actions/shop";
import styles from "./page.module.css";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    if (!data.subject) {
      setMessage("Please select a subject.");
      setLoading(false);
      return;
    }

    const res = await submitEnquiry(data);
    if (res.success) {
      setMessage("Your message has been sent! We will get back to you shortly.");
      (e.target as HTMLFormElement).reset();
    } else {
      setMessage(res.error || "Failed to send message. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <form className="card" style={{ padding: "2rem" }} onSubmit={handleSubmit}>
      {message && (
        <div style={{ padding: "1rem", marginBottom: "1rem", borderRadius: "8px", background: message.includes("sent") ? "#d4edda" : "#f8d7da", color: message.includes("sent") ? "#155724" : "#721c24" }}>
          {message}
        </div>
      )}
      
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.formLabel}>Full Name</label>
        <input type="text" id="name" name="name" className={styles.formInput} placeholder="Jane Doe" required />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.formLabel}>Email Address</label>
        <input type="email" id="email" name="email" className={styles.formInput} placeholder="jane@example.com" required />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="subject" className={styles.formLabel}>Subject</label>
        <select id="subject" name="subject" className={styles.formInput} defaultValue="" required>
          <option value="" disabled>Select an option</option>
          <option value="mehndi">Mehndi Booking</option>
          <option value="custom_art">Custom Art Order</option>
          <option value="classes">Classes & Tuition</option>
          <option value="general">General Enquiry</option>
        </select>
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="message" className={styles.formLabel}>Message</label>
        <textarea id="message" name="message" className={styles.formTextarea} placeholder="How can we help you?" required></textarea>
      </div>
      
      <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
