import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Create. Learn. Celebrate.</h1>
          <p className={styles.heroSubtitle}>
            Premium Indian creative studio offering Mehndi design, art & craft, dance tuition, DIY projects, custom products, and workshops.
          </p>
          <div className={styles.heroActions}>
            <Link href="/services" className="btn btn-primary">
              Explore Services
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              Book a Session
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={`section ${styles.servicesSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Our Expertise</h2>
            <p className="text-muted">Discover the creative services we offer with passion and precision.</p>
          </div>
          
          <div className={styles.serviceGrid}>
            <div className={`card ${styles.serviceCard}`}>
              <div className={styles.serviceIcon}>✨</div>
              <h3 className={styles.serviceTitle}>Bridal & Occasion Mehndi</h3>
              <p className={styles.serviceDesc}>Intricate, traditional, and modern henna designs for your special day.</p>
            </div>
            
            <div className={`card ${styles.serviceCard}`}>
              <div className={styles.serviceIcon}>🎨</div>
              <h3 className={styles.serviceTitle}>Art & Craft Customization</h3>
              <p className={styles.serviceDesc}>Handmade customized products, DIY projects, and bulk creative orders.</p>
            </div>
            
            <div className={`card ${styles.serviceCard}`}>
              <div className={styles.serviceIcon}>💃</div>
              <h3 className={styles.serviceTitle}>Dance & Creative Classes</h3>
              <p className={styles.serviceDesc}>Learn dance, painting, and craft through engaging workshops and home tuition.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Overview */}
      <section className={`section ${styles.aboutSection}`}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutContent}>
              <h2 className={styles.aboutTitle}>Made With Heart.</h2>
              <p>
                ANANTA is more than just a business; it's a creative sanctuary. 
                Founded by Anant, our studio brings together 
                traditional Indian artistry with modern aesthetics.
              </p>
              <p>
                Whether you need elegant bridal Mehndi, a custom handmade gift, or want to 
                learn a new skill in our creative workshops, we put our heart into every detail.
              </p>
              
              <div className={styles.featuresGrid}>
                <div className={styles.featureItem}>
                  <span>✓</span> Premium Quality
                </div>
                <div className={styles.featureItem}>
                  <span>✓</span> Custom Designs
                </div>
                <div className={styles.featureItem}>
                  <span>✓</span> Expert Instructors
                </div>
                <div className={styles.featureItem}>
                  <span>✓</span> Timely Delivery
                </div>
              </div>
              
              <div style={{ marginTop: "2rem" }}>
                <Link href="/about" className="btn btn-secondary">
                  Our Story
                </Link>
              </div>
            </div>
            
            <div className={styles.aboutImage}>
              {/* Placeholder for real brand imagery */}
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--primary-light)", color: "white", fontSize: "1.5rem", fontStyle: "italic" }}>
                ANANTA Studio
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
