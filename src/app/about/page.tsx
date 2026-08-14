import { Metadata } from "next";
import styles from "./page.module.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | NAVAÉ Art & Craft",
  description: "Learn about NAVAÉ Art & Craft, our founders Navya and Anant, and our journey in creating a premium Indian creative studio.",
};

export default function AboutPage() {
  return (
    <main>
      <section className={styles.aboutHero}>
        <div className="container">
          <h1 className={styles.aboutHeroTitle}>Our Story</h1>
          <p className={styles.aboutHeroSubtitle}>
            Where tradition meets modern creativity.
          </p>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.twoColumnGrid}>
            <div>
              <h2 className="text-primary" style={{ marginBottom: "1.5rem" }}>The Vision</h2>
              <p>
                NAVAÉ Art & Craft was born from a passion for preserving and reimagining Indian arts. 
                What started as a love for intricate Mehndi designs and handmade crafts has blossomed 
                into a full-fledged creative studio that celebrates art in all its forms.
              </p>
              <p>
                We believe that creativity is a journey meant to be shared. That's why we don't just 
                create; we teach, we customize, and we bring your artistic visions to life. From a 
                bride's Mehndi to a student's first brushstroke, we put our heart into everything we do.
              </p>

              <div className={styles.founderBox}>
                <h3>Navya</h3>
                <p style={{ marginBottom: "1rem" }}><strong>Founder & Lead Artist</strong></p>
                <p>
                  With years of experience in Mehndi design, drawing, painting, and DIY crafts, 
                  Navya is the creative heart of NAVAÉ. She also leads our dance and tuition classes, 
                  inspiring the next generation of creatives.
                </p>
              </div>

              <div className={styles.founderBox}>
                <h3>Anant</h3>
                <p style={{ marginBottom: "1rem" }}><strong>Co-Partner & Operations Head</strong></p>
                <p>
                  The backbone of the business, Anant ensures everything runs smoothly. From digital 
                  marketing to handling our customized and bulk orders seamlessly, Anant brings the 
                  NAVAÉ vision to the world.
                </p>
              </div>
            </div>
            <div>
              <div className={styles.imagePlaceholder}>
                [Founders / Studio Photo]
              </div>
            </div>
          </div>
          
          <div className="text-center" style={{ marginTop: "5rem" }}>
            <h3 style={{ marginBottom: "1.5rem" }}>Ready to create with us?</h3>
            <Link href="/contact" className="btn btn-primary">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
