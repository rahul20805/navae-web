import { getClasses } from "@/actions/bookings";
import styles from "./page.module.css";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Classes & Tuition | ANANTA",
  description: "Book professional dance choreography, art workshops, and academic home tuition.",
};

export const revalidate = 60;

export default async function ClassesPage() {
  const classes = await getClasses();

  return (
    <main>
      <section className={styles.classesHero}>
        <div className="container">
          <h1 className="text-primary" style={{ fontSize: "3rem", marginBottom: "1rem" }}>Learn with ANANTA</h1>
          <p className="text-muted" style={{ fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
            Unleash your creativity and skills through our interactive classes and expert tuition.
          </p>
        </div>
      </section>

      <section className="container">
        {classes.length === 0 ? (
          <div style={{ padding: "5rem 0", textAlign: "center" }}>
            <h2>New batches are starting soon!</h2>
            <p className="text-muted">Please check back later for our updated class schedule.</p>
          </div>
        ) : (
          <div className={styles.classesGrid}>
            {classes.map((cls) => (
              <Link href={`/classes/${cls.slug}`} key={cls.id} className={styles.classCard}>
                <div className={styles.classImage}>
                  {cls.image ? (
                    <img src={cls.image} alt={cls.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>
                <div className={styles.classInfo}>
                  <h3 className={styles.className}>{cls.title}</h3>
                  <div className={styles.classDetail}>📅 {cls.schedule || "Flexible Timing"}</div>
                  <div className={styles.classDetail}>⏱️ {cls.duration || "1 Hour"}</div>
                  <div className={styles.classDetail}>🧑‍🏫 {cls.instructor || "ANANTA Expert"}</div>
                  <div className={styles.classPrice}>
                    {cls.price ? `₹${cls.price.toFixed(2)}` : "Contact for Pricing"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
