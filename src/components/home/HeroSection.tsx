import Link from "next/link";
import Image from "next/image";

export default function HeroSection({ content }: { content?: any }) {
  const title = content?.title || "Handmade. Personal. Unforgettable.";
  const subtitle = content?.subtitle || "Beautiful handmade creations, personalized gifts and creative experiences made specially for your special moments.";
  const imageUrl = content?.imageUrl || "/images/hero_banner.jpg";

  return (
    <section style={{ backgroundColor: "var(--bg-main)", minHeight: "80vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", padding: "6rem 0" }}>
      <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
        
        {/* Text Content */}
        <div className="animate-fade-in" style={{ zIndex: 10 }}>
          <h1 style={{ color: "var(--primary)", marginBottom: "1.5rem", fontSize: "clamp(3rem, 5vw, 4.5rem)", lineHeight: 1.1 }}>
            {title}
          </h1>
          <p style={{ fontSize: "1.25rem", color: "var(--text-muted)", marginBottom: "3rem", fontWeight: 400, lineHeight: 1.6 }}>
            {subtitle}
          </p>
          
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/shop" className="btn btn-primary" style={{ padding: "1.1rem 2.5rem", fontSize: "1.1rem" }}>
              Shop Handmade Gifts
            </Link>
            <Link href="/custom-gift" className="btn btn-secondary" style={{ padding: "1.1rem 2.5rem", fontSize: "1.1rem", borderColor: "var(--primary)", color: "var(--primary)" }}>
              Create a Custom Gift
            </Link>
          </div>
        </div>

        {/* Image Content */}
        <div className="animate-fade-in" style={{ position: "relative", height: "600px", borderRadius: "var(--radius-xl)", overflow: "hidden", boxShadow: "var(--shadow-lg)" }}>
          <Image 
            src={imageUrl} 
            alt="ANANTA Hero Imagery" 
            fill 
            style={{ objectFit: "cover" }} 
            priority
          />
        </div>
      </div>
      
      {/* Decorative Blur Element */}
      <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "50%", height: "50%", background: "var(--secondary-light)", filter: "blur(150px)", opacity: 0.15, zIndex: 1, pointerEvents: "none" }}></div>
    </section>
  );
}
