import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/home/HeroSection";
import GiftFinder from "@/components/home/GiftFinder";
import CategoryCards from "@/components/home/CategoryCards";
import ProductCarousel from "@/components/home/ProductCarousel";
import AIGallery from "@/components/home/AIGallery";
import Link from "next/link";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  // Fetch homepage content if we have it
  const heroContent = await prisma.websiteContent.findUnique({
    where: { section: "hero_banner" }
  });

  // Fetch some products for the carousel
  const recentProducts = await prisma.product.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    take: 8,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      discountPrice: true,
      images: true,
      customization: true,
    }
  });

  const occasionCategories = [
    { name: "Birthday Gifts", icon: "🎂", link: "/shop?occasion=birthday" },
    { name: "Anniversary", icon: "❤️", link: "/shop?occasion=anniversary" },
    { name: "Wedding", icon: "💍", link: "/shop?occasion=wedding" },
    { name: "Valentine's", icon: "🌹", link: "/shop?occasion=valentine" },
  ];

  const recipientCategories = [
    { name: "For Girlfriend", icon: "💕", link: "/shop?recipient=girlfriend" },
    { name: "For Boyfriend", icon: "💙", link: "/shop?recipient=boyfriend" },
    { name: "For Couples", icon: "💑", link: "/shop?recipient=couple" },
    { name: "For Friends", icon: "👭", link: "/shop?recipient=friend" },
  ];

  return (
    <main>
      <HeroSection content={heroContent?.content} />
      
      {/* 2. Shop by Occasion */}
      <section className="section bg-alt" style={{ padding: "4rem 0" }}>
        <div className="container">
          <CategoryCards title="Shop by Occasion" items={occasionCategories} />
        </div>
      </section>

      {/* 3. Shop by Recipient */}
      <section className="section" style={{ padding: "4rem 0" }}>
        <div className="container">
          <CategoryCards title="Shop by Recipient" items={recipientCategories} />
        </div>
      </section>
      
      {/* 4. Featured Handmade Gifts */}
      <section className="section bg-alt" style={{ padding: "5rem 0" }}>
        <ProductCarousel title="Featured Handmade Gifts" products={recentProducts} />
      </section>

      {/* 5. Create Your Own Gift */}
      <section className="section" style={{ background: "var(--primary)", color: "white", textAlign: "center", padding: "6rem 1rem" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <h2 style={{ color: "var(--accent)", marginBottom: "1.5rem", fontSize: "2.5rem" }}>Create Something Special</h2>
          <p style={{ fontSize: "1.2rem", marginBottom: "2.5rem", opacity: 0.9, lineHeight: 1.6 }}>
            Can't find exactly what you're looking for? Let us create a personalized, handmade masterpiece just for you. From custom resin art to personalized memory boxes.
          </p>
          <Link href="/custom-gift" className="btn btn-primary" style={{ background: "white", color: "var(--primary-dark)", padding: "1rem 3rem", fontSize: "1.1rem" }}>
            Start Custom Gift
          </Link>
        </div>
      </section>

      {/* 6-10. Services & Classes */}
      <section className="section bg-main" style={{ padding: "6rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 style={{ color: "var(--primary)" }}>Creative Services & Experiences</h2>
            <p className="text-muted" style={{ fontSize: "1.1rem" }}>Explore our professional workshops, classes, and personalized services.</p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.5rem" }}>
            {[
              { title: "Mehndi Design", desc: "Bridal & Custom Mehndi", link: "/services#mehndi", img: "https://images.unsplash.com/photo-1598284534125-78e718818fce?w=500&q=80" },
              { title: "Dance Classes", desc: "For Kids & Adults", link: "/classes", img: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=500&q=80" },
              { title: "DIY Workshops", desc: "Learn Art & Craft", link: "/classes", img: "https://images.unsplash.com/photo-1460518451285-97b6aa326961?w=500&q=80" },
              { title: "Home Tuition", desc: "Academic Support", link: "/services#tuition", img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80" }
            ].map((srv, i) => (
              <Link href={srv.link} key={i} className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", border: "1px solid var(--border-color)" }}>
                <div style={{ height: "220px", background: `url(${srv.img}) center/cover` }}></div>
                <div style={{ padding: "2rem", textAlign: "center", background: "var(--bg-surface)" }}>
                  <h3 style={{ fontSize: "1.4rem", marginBottom: "0.5rem", color: "var(--primary-dark)" }}>{srv.title}</h3>
                  <p style={{ margin: 0, color: "var(--text-muted)" }}>{srv.desc}</p>
                </div>
              </Link>
            ))}
          </div>
          
          <div style={{ textAlign: "center", marginTop: "4rem" }}>
            <Link href="/services" className="btn btn-secondary" style={{ padding: "1rem 3rem", borderColor: "var(--primary)", color: "var(--primary)" }}>
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* 11. Gallery */}
      <section className="section bg-alt" style={{ padding: "6rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ color: "var(--primary)" }}>Handmade Inspirations</h2>
            <p className="text-muted">A gallery of our favorite personalized creations.</p>
          </div>
          <AIGallery />
        </div>
      </section>

    </main>
  );
}
