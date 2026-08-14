import { prisma } from "@/lib/prisma";
import MasonryLightbox from "@/components/gallery/MasonryLightbox";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | ANANTA",
  description: "View our portfolio of handmade gifts, art, craft, and mehndi designs.",
};

export const revalidate = 60;

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const categoryFilter = searchParams.category;

  const whereClause = categoryFilter 
    ? { isPublished: true, category: categoryFilter }
    : { isPublished: true };

  const images = await prisma.gallery.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  // Get unique categories for filter chips
  const allImages = await prisma.gallery.findMany({
    where: { isPublished: true },
    select: { category: true }
  });
  
  const categories = Array.from(new Set(allImages.map(img => img.category).filter(Boolean))) as string[];

  return (
    <main className="bg-alt" style={{ minHeight: "100vh", paddingTop: "3rem", paddingBottom: "5rem" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 className="text-primary" style={{ marginBottom: "1rem" }}>Our Portfolio</h1>
          <p className="text-muted" style={{ maxWidth: "600px", margin: "0 auto" }}>
            A collection of our favorite handmade creations, custom gifts, and creative experiences.
          </p>
        </div>

        {categories.length > 0 && (
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem" }}>
            <a 
              href="/gallery" 
              className={`btn ${!categoryFilter ? "btn-primary" : "btn-secondary"}`}
              style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
            >
              All
            </a>
            {categories.map((cat) => (
              <a 
                key={cat}
                href={`/gallery?category=${encodeURIComponent(cat)}`} 
                className={`btn ${categoryFilter === cat ? "btn-primary" : "btn-secondary"}`}
                style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
              >
                {cat}
              </a>
            ))}
          </div>
        )}

        <MasonryLightbox images={images} />
      </div>
    </main>
  );
}
