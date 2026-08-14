import { getClassBySlug } from "@/actions/bookings";
import { notFound } from "next/navigation";
import styles from "../page.module.css";
import BookClassForm from "@/components/bookings/BookClassForm";

export default async function ClassDetailPage({ params }: { params: { slug: string } }) {
  const cls = await getClassBySlug(params.slug);

  if (!cls) {
    notFound();
  }

  return (
    <main className="container">
      <div className={styles.detailGrid}>
        <div>
          <div className={styles.detailImage}>
            {cls.image ? (
              <img src={cls.image} alt={cls.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />
            ) : (
              <span>No Image</span>
            )}
          </div>
          
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{cls.title}</h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "2rem" }}>
            {cls.description || "Join this exciting class to learn new skills with ANANTA."}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
            <div className={styles.classDetail}><strong>📅 Schedule:</strong> {cls.schedule || "Flexible Timing"}</div>
            <div className={styles.classDetail}><strong>⏱️ Duration:</strong> {cls.duration || "1 Hour"}</div>
            <div className={styles.classDetail}><strong>🧑‍🏫 Instructor:</strong> {cls.instructor || "ANANTA Expert"}</div>
            <div className={styles.classDetail}><strong>👥 Max Students:</strong> {cls.maxStudents || "10"} per batch</div>
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
