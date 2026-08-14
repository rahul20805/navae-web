import { Metadata } from "next";
import styles from "./page.module.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Services | ANANTA",
  description: "Explore our premium services including Mehndi Design, Custom Art & Craft, and Dance & Tuition Classes.",
};

export default function ServicesPage() {
  return (
    <main>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Our Services</h1>
          <p className={styles.subtitle}>
            Discover the artistry and passion behind our creative offerings. 
            From elegant bridal Mehndi to customized handmade gifts.
          </p>
        </div>
      </section>

      {/* Mehndi Service */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.content}>
              <h2>Bridal & Occasion Mehndi</h2>
              <p>
                Our signature Mehndi services blend traditional Indian motifs with contemporary elegance. 
                Whether it's for a bride on her special day, festivals, or private parties, we ensure 
                deep stains and flawless artistry.
              </p>
              <ul className={styles.featuresList}>
                <li><span>✦</span> Custom Bridal Designs</li>
                <li><span>✦</span> Organic, Chemical-Free Henna</li>
                <li><span>✦</span> Guest Mehndi Packages</li>
                <li><span>✦</span> Minimalist & Arabic Styles</li>
              </ul>
              <Link href="/contact" className="btn btn-primary">Book Now</Link>
            </div>
            <div className={styles.imageBox}>
              [Mehndi Artwork Image]
            </div>
          </div>
        </div>
      </section>

      {/* Art & Craft Service */}
      <section className={styles.sectionAlt}>
        <div className="container">
          <div className={`${styles.grid} ${styles.reverse}`}>
            <div className={styles.content}>
              <h2>Custom Art & Craft</h2>
              <p>
                Looking for the perfect personalized gift or bespoke decor? We create stunning handmade 
                crafts tailored specifically to your vision. Perfect for corporate gifting, weddings, 
                and home decoration.
              </p>
              <ul className={styles.featuresList}>
                <li><span>✦</span> Resin Art & Nameplates</li>
                <li><span>✦</span> Handmade Greeting Cards</li>
                <li><span>✦</span> Custom Canvas Paintings</li>
                <li><span>✦</span> Bulk Festival Gifting</li>
              </ul>
              <Link href="/contact" className="btn btn-primary">Request Custom Order</Link>
            </div>
            <div className={styles.imageBox}>
              [Art & Craft Image]
            </div>
          </div>
        </div>
      </section>

      {/* Classes Service */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.content}>
              <h2>Dance & Tuition Classes</h2>
              <p>
                Unleash your creativity and skills through our interactive classes. We offer professional 
                dance choreography, art workshops, and academic tuition to help students excel in every aspect.
              </p>
              <ul className={styles.featuresList}>
                <li><span>✦</span> Wedding Choreography</li>
                <li><span>✦</span> Weekend Art Workshops</li>
                <li><span>✦</span> Academic Home Tuition</li>
                <li><span>✦</span> Kids Summer Camps</li>
              </ul>
              <Link href="/classes" className="btn btn-secondary">View Schedule</Link>
            </div>
            <div className={styles.imageBox}>
              [Classes Image]
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container">
          <h2 style={{ marginBottom: "1.5rem", color: "var(--primary-dark)" }}>Ready to bring your vision to life?</h2>
          <Link href="/contact" className="btn btn-primary">
            Contact Us Today
          </Link>
        </div>
      </section>
    </main>
  );
}
