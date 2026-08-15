import { getClassBySlug } from "@/actions/bookings";
import { notFound } from "next/navigation";
import styles from "../page.module.css";
import BookClassForm from "@/components/bookings/BookClassForm";
import { Metadata } from "next";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cls = await getClassBySlug(slug);
  return {
    title: cls ? `${cls.title} | Classes | ANANTA` : "Class Not Found | ANANTA",
    description: cls?.description || "Book an art class with ANANTA.",
  };
}

export default async function ClassDetailPage({ params }: Props) {
  const { slug } = await params;
  const cls = await getClassBySlug(slug);

  if (!cls) {
    notFound();
  }

  return (
    <main className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      <Link href="/classes" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", marginBottom: "2rem", textDecoration: "none" }}>
        ← Back to Classes
      </Link>
      <div className={styles.detailGrid}>
        <div>
          <div className={styles.detailImage}>
            {cls.image ? (
              <img src={cls.image} alt={cls.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem" }}>🎨</div>
            )}
          </div>
          
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{cls.title}</h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "2rem" }}>
            {cls.description || "Join this exciting class to learn new skills with ANANTA."}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
            {cls.schedule && <div className={styles.classDetail}><strong>📅 Schedule:</strong> {cls.schedule}</div>}
            {cls.duration && <div className={styles.classDetail}><strong>⏱️ Duration:</strong> {cls.duration}</div>}
            {cls.instructor && <div className={styles.classDetail}><strong>🧑‍🏫 Instructor:</strong> {cls.instructor}</div>}
            {cls.maxStudents && <div className={styles.classDetail}><strong>👥 Max Students:</strong> {cls.maxStudents} per batch</div>}
          </div>
        </div>
        
        <div>
          <div className={styles.bookingCard}>
            <h2 style={{ marginBottom: "0.5rem" }}>Book Your Spot</h2>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary)", marginBottom: "2rem" }}>
              {cls.price ? `₹${cls.price.toFixed(2)}` : "Contact for Pricing"}
            </div>
            
            <BookClassForm classId={cls.id} />
          </div>
        </div>
      </div>
    </main>
  );
}
