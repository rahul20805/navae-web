import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Classes & Tuition | ANANTA",
  description: "Book professional dance choreography, art workshops, and academic home tuition.",
};

export const revalidate = 60;

export default async function ClassesPage() {
  const classes = await prisma.class.findMany({
    where: { isPublished: true, isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="bg-alt" style={{ minHeight: "100vh" }}>
      <section className="container section" style={{ paddingTop: "3rem", paddingBottom: "2rem", textAlign: "center" }}>
        <h1 className="text-primary" style={{ marginBottom: "1rem" }}>Learn with ANANTA</h1>
        <p className="text-muted" style={{ maxWidth: "600px", margin: "0 auto", fontSize: "1.1rem" }}>
          Unleash your creativity and skills through our interactive classes and expert tuition.
        </p>
      </section>

      <section className="container" style={{ paddingBottom: "5rem" }}>
        {classes.length === 0 ? (
          <div className="card text-center" style={{ padding: "5rem 2rem" }}>
            <h2>New batches are starting soon!</h2>
            <p className="text-muted">Please check back later for our updated class schedule.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
            {classes.map((cls) => (
              <Link href={`/classes/${cls.slug}`} key={cls.id} className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", backgroundColor: "#f0f0f0" }}>
                  {cls.image ? (
                    <Image src={cls.image} alt={cls.title} fill style={{ objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>No Image</div>
                  )}
                  {cls.price && (
                    <div style={{ position: "absolute", top: "1rem", right: "1rem", background: "var(--bg-surface)", color: "var(--primary)", fontWeight: "bold", padding: "0.5rem 1rem", borderRadius: "var(--radius-full)", boxShadow: "var(--shadow-sm)" }}>
                      ₹{cls.price}
                    </div>
                  )}
                </div>
                
                <div style={{ padding: "1.5rem", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>{cls.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "1.5rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {cls.description}
                  </p>
                  
                  <div style={{ marginTop: "auto", display: "grid", gap: "0.5rem", fontSize: "0.9rem", color: "var(--text-main)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ color: "var(--text-muted)" }}>📅</span> {cls.schedule || "Flexible Timing"}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ color: "var(--text-muted)" }}>⏱️</span> {cls.duration || "1 Hour"}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ color: "var(--text-muted)" }}>👩‍🏫</span> {cls.instructor || "ANANTA Expert"}
                    </div>
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
