import Link from "next/link";
import Image from "next/image";

export default function HeroSection({ content }: { content?: any }) {
  const title = content?.title || "Handmade. Personal. Unforgettable.";
  const subtitle = content?.subtitle || "Beautiful handmade creations, personalized gifts and creative experiences made specially for your special moments.";
  const imageUrl = content?.imageUrl || "/images/hero_banner.jpg";

  return (
    <section style={{ position: "relative", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {/* Background Image */}
      <div style={{ position: "absolute", inset: 0, zIndex: -1 }}>
        <Image 
          src={imageUrl} 
          alt="ANANTA Hero Background" 
          fill 
          style={{ objectFit: "cover", filter: "brightness(0.6)" }} 
          priority
        />
      </div>

      <div className="container animate-fade-in" style={{ textAlign: "center", color: "var(--text-light)", padding: "2rem", zIndex: 10 }}>
        <h1 style={{ color: "var(--secondary)", textShadow: "2px 2px 8px rgba(0,0,0,0.5)", marginBottom: "1.5rem" }}>
          {title}
        </h1>
        <p style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)", maxWidth: "800px", margin: "0 auto 3rem auto", textShadow: "1px 1px 4px rgba(0,0,0,0.5)", fontWeight: 300, letterSpacing: "0.5px" }}>
          {subtitle}
        </p>
        
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/shop" className="btn btn-primary" style={{ padding: "1rem 2.5rem", fontSize: "1.1rem", background: "var(--secondary)", color: "var(--text-main)" }}>
            Shop Now
          </Link>
          <Link href="/shop?custom=true" className="btn btn-secondary" style={{ padding: "1rem 2.5rem", fontSize: "1.1rem", borderColor: "var(--text-light)", color: "var(--text-light)" }}>
            Create Custom Gift
          </Link>
          <Link href="/services" className="btn btn-secondary" style={{ padding: "1rem 2.5rem", fontSize: "1.1rem", borderColor: "var(--text-light)", color: "var(--text-light)" }}>
            Book a Service
          </Link>
        </div>
      </div>
    </section>
  );
}
