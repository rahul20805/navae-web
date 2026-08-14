import Link from "next/link";
import Image from "next/image";

type CategoryProps = {
  title: string;
  items: { name: string; icon: string; link: string }[];
};

export default function CategoryCards({ title, items }: CategoryProps) {
  return (
    <>
      <h2 className="text-center" style={{ marginBottom: "3rem", color: "var(--primary)" }}>{title}</h2>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "2rem",
        justifyItems: "center"
      }}>
        {items.map((item, i) => (
          <Link 
            href={item.link} 
            key={i} 
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.5rem",
              padding: "2.5rem 1.5rem",
              background: "var(--bg-surface)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--shadow-sm)",
              width: "100%",
              textAlign: "center",
              transition: "all var(--transition-normal)",
              textDecoration: "none",
              color: "var(--text-main)",
              border: "1px solid var(--border-color)",
              position: "relative",
              overflow: "hidden"
            }}
            className="category-card"
          >
            <div style={{ fontSize: "3rem", zIndex: 2 }}>{item.icon}</div>
            <h4 style={{ fontSize: "1.2rem", fontWeight: 600, margin: 0, zIndex: 2 }}>{item.name}</h4>
            
            <div className="hover-bg" style={{ position: "absolute", inset: 0, background: "var(--bg-alt)", opacity: 0, transition: "opacity var(--transition-normal)", zIndex: 1 }}></div>

            <style>{`
              .category-card:hover {
                transform: translateY(-8px);
                box-shadow: var(--shadow-lg);
                border-color: var(--primary-light);
              }
              .category-card:hover .hover-bg {
                opacity: 0.3;
              }
              .category-card:hover h4 {
                color: var(--primary);
              }
            `}</style>
          </Link>
        ))}
      </div>
    </>
  );
}
