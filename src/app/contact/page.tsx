import { Metadata } from "next";
import styles from "./page.module.css";
import ContactForm from "./ContactForm";

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
                <p>Varanasi, India<br/>(Full address provided upon booking)</p>
              </div>
              <div className={styles.infoItem}>
                <h4>Email</h4>
                <p>anyanant7115@gmail.com</p>
              </div>
              <div className={styles.infoItem}>
                <h4>Phone</h4>
                <p>+91 7379609531</p>
              </div>
              <div className={styles.infoItem}>
                <h4>Instagram</h4>
                <p><a href="https://instagram.com/infiny.pvt" target="_blank" rel="noopener noreferrer" style={{color: "var(--primary)"}}>@infiny.pvt</a></p>
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
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
