import Link from "next/link";
import styles from "./page.module.css";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const settingsData = await prisma.setting.findMany();
  const settings = settingsData.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const heroTitle = settings.heroTitle || "Create. Learn. Celebrate.";
  const heroSubtitle = settings.heroSubtitle || "Premium Indian creative studio offering Mehndi design, art & craft, dance tuition, DIY projects, custom products, and workshops.";
  const aboutText = settings.aboutText || "ANANTA is more than just a business; it's a creative sanctuary.\nFounded by Anant, our studio brings together traditional Indian artistry with modern aesthetics.";
  const heroImage = settings.heroImage || "";
  const announcementBar = settings.announcementBar || "";

  return (
    <main>
      {announcementBar && (
        <div style={{ background: "var(--primary-dark)", color: "white", textAlign: "center", padding: "0.5rem", fontSize: "0.9rem" }}>
          {announcementBar}
        </div>
      )}
      
      {/* Hero Section */}
      <section className={styles.hero} style={heroImage ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}>
        {!heroImage && <div className={styles.heroBackground}></div>}
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{heroTitle}</h1>
          <p className={styles.heroSubtitle}>
            {heroSubtitle}
          </p>
          <div className={styles.heroActions}>
            <Link href="/shop" className="btn btn-primary">
              Explore Shop
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              Book a Service
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
              <p style={{ whiteSpace: "pre-line" }}>
                {aboutText}
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
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--primary-light)", color: "white", fontSize: "1.5rem", fontStyle: "italic" }}>
                {settings.businessName || "ANANTA"} Studio
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
