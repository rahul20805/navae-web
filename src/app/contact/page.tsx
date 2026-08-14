import { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact Us | ANANTA",
  description: "Get in touch with ANANTA for custom art orders, Mehndi bookings, or class registrations.",
};

export default function ContactPage() {
  return (
    <main>
      <section className={styles.contactHero}>
        <div className="container">
          <h1 className="text-primary" style={{ marginBottom: "1rem", fontSize: "clamp(2.5rem, 4vw, 4rem)" }}>Get in Touch</h1>
          <p className="text-muted" style={{ maxWidth: "600px", margin: "0 auto", fontSize: "1.25rem" }}>
            Whether you have a question about our services, want to book a session, or request a custom order, we'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="container">
        <div className={styles.contactGrid}>
          {/* Contact Information */}
          <div>
            <h2 style={{ marginBottom: "2rem" }}>Contact Information</h2>
            
            <div className={styles.contactInfoBox}>
              <h3>Visit Our Studio</h3>
              <div className={styles.infoItem}>
                <h4>Address</h4>
                <p>New Delhi, India<br/>(Full address provided upon booking)</p>
              </div>
              <div className={styles.infoItem}>
                <h4>Email</h4>
                <p>hello@ananta.studio</p>
              </div>
              <div className={styles.infoItem}>
                <h4>Phone</h4>
                <p>+91 98765 43210</p>
              </div>
              <div className={styles.infoItem}>
                <h4>Working Hours</h4>
                <p>Monday - Saturday: 10:00 AM - 7:00 PM<br/>Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 style={{ marginBottom: "2rem" }}>Send us a Message</h2>
            <form className="card" style={{ padding: "2rem" }}>
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
                <select id="subject" name="subject" className={styles.formInput} required>
                  <option value="" disabled selected>Select an option</option>
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
              
              <button type="button" className="btn btn-primary" style={{ width: "100%" }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
