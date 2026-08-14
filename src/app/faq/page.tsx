import { Metadata } from "next";
import styles from "./page.module.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ | ANANTA",
  description: "Frequently Asked Questions about ANANTA's services, bookings, and custom orders.",
};

export default function FAQPage() {
  return (
    <main>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Frequently Asked Questions</h1>
          <p className={styles.subtitle}>
            Find answers to common questions about our services, bookings, and policies.
          </p>
        </div>
      </section>

      <section className="container">
        <div className={styles.faqSection}>
          
          <div className={styles.faqCategory}>
            <h2 className={styles.categoryTitle}>Mehndi Services</h2>
            
            <div className={styles.faqItem}>
              <h3 className={styles.question}>Do you travel for bridal Mehndi?</h3>
              <p className={styles.answer}>
                Yes, we do travel to the venue or hotel for bridal Mehndi services within the city. 
                For outstation events, travel and accommodation charges will apply. Please mention 
                your location when submitting a booking enquiry.
              </p>
            </div>
            
            <div className={styles.faqItem}>
              <h3 className={styles.question}>Is your Mehndi organic and chemical-free?</h3>
              <p className={styles.answer}>
                Absolutely. We prepare our own Mehndi cones using 100% natural, premium quality henna 
                leaves and essential oils. Our paste is completely free of harmful chemicals and PPD.
              </p>
            </div>
          </div>

          <div className={styles.faqCategory}>
            <h2 className={styles.categoryTitle}>Custom Art & Craft</h2>
            
            <div className={styles.faqItem}>
              <h3 className={styles.question}>How long does a custom order take?</h3>
              <p className={styles.answer}>
                The timeline depends on the complexity and scale of the project. A single custom resin 
                nameplate might take 5-7 days, while bulk festival gifting or wedding favors require at 
                least 3-4 weeks of notice.
              </p>
            </div>
            
            <div className={styles.faqItem}>
              <h3 className={styles.question}>Do you take bulk orders for corporate gifting?</h3>
              <p className={styles.answer}>
                Yes, we specialize in bulk handmade gifts for corporate events, weddings, and festivals. 
                Contact us early with your requirements for bulk pricing and customization options.
              </p>
            </div>
          </div>

          <div className={styles.faqCategory}>
            <h2 className={styles.categoryTitle}>Classes & Tuition</h2>
            
            <div className={styles.faqItem}>
              <h3 className={styles.question}>Do I need prior experience to join the art or dance workshops?</h3>
              <p className={styles.answer}>
                Not at all! We have workshops tailored for absolute beginners as well as advanced learners. 
                Our expert instructors guide you step-by-step regardless of your skill level.
              </p>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "4rem" }}>
            <h3 style={{ marginBottom: "1rem" }}>Still have questions?</h3>
            <Link href="/contact" className="btn btn-primary">
              Contact Us
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
