import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Our Services | ANANTA",
  description: "Explore our premium services including Mehndi Design, Custom Art & Craft, and Dance & Tuition Classes.",
};

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isPublished: true, isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="bg-alt" style={{ minHeight: "100vh" }}>
      <section className="container section" style={{ paddingTop: "3rem", paddingBottom: "2rem", textAlign: "center" }}>
        <h1 className="text-primary" style={{ marginBottom: "1rem" }}>Our Services</h1>
        <p className="text-muted" style={{ maxWidth: "600px", margin: "0 auto", fontSize: "1.1rem" }}>
          Discover the artistry and passion behind our creative offerings. 
          From elegant bridal Mehndi to academic tuition.
        </p>
      </section>

      {services.length === 0 ? (
        <section className="container section text-center">
          <h2>Services are currently being updated.</h2>
          <p className="text-muted">Please check back soon.</p>
        </section>
      ) : (
        <section className="container" style={{ paddingBottom: "5rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
            {services.map((service, index) => (
              <div 
                key={service.id} 
                id={service.slug}
                className="card" 
                style={{ 
                  display: "grid", 
                  gridTemplateColumns: index % 2 === 0 ? "1fr 1fr" : "1fr 1fr", 
                  gap: "3rem", 
                  alignItems: "center",
                  padding: "2rem"
                }}
              >
                {/* Image side */}
                <div style={{ order: index % 2 === 0 ? 1 : 2, position: "relative", width: "100%", aspectRatio: "4/3", borderRadius: "var(--radius-md)", overflow: "hidden", backgroundColor: "#eee" }}>
                  {service.image ? (
                    <Image src={service.image} alt={service.title} fill style={{ objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
                      No Image Provided
                    </div>
                  )}
                </div>

                {/* Content side */}
                <div style={{ order: index % 2 === 0 ? 2 : 1 }}>
                  <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{service.title}</h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                    {service.description}
                  </p>
                  
                  {service.features && service.features.length > 0 && (
                    <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem 0", display: "grid", gap: "0.5rem" }}>
                      {service.features.map((feature, i) => (
                        <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 500 }}>
                          <span style={{ color: "var(--primary)" }}>✦</span> {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link 
                    href={`/contact?service=${service.slug}`} 
                    className="btn btn-primary"
                  >
                    Enquire Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Embedded DIY & Workshops CTA */}
      <section className="section" style={{ background: "var(--primary)", color: "white", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ color: "var(--secondary-light)", marginBottom: "1.5rem" }}>Looking for Classes or Workshops?</h2>
          <p style={{ fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto 2rem auto", opacity: 0.9 }}>
            We offer interactive dance classes, DIY workshops, and academic home tuition. 
            View our schedule and book your slot today.
          </p>
          <Link href="/classes" className="btn" style={{ background: "white", color: "var(--primary-dark)" }}>
            View Class Schedule
          </Link>
        </div>
      </section>
    </main>
  );
}
