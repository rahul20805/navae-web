import Link from "next/link";
import Image from "next/image";

type CategoryProps = {
  title: string;
  items: { name: string; icon: string; link: string }[];
};

export default function CategoryCards({ title, items }: CategoryProps) {
  return (
    <section className="section bg-alt">
      <div className="container">
        <h2 className="text-center" style={{ marginBottom: "3rem" }}>{title}</h2>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "1.5rem",
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
                gap: "1rem",
                padding: "1.5rem 1rem",
                background: "var(--bg-surface)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-sm)",
                width: "100%",
                textAlign: "center",
                transition: "all var(--transition-normal)",
                textDecoration: "none",
                color: "var(--text-main)"
              }}
              className="category-card"
            >
              <div style={{ fontSize: "2.5rem" }}>{item.icon}</div>
              <h4 style={{ fontSize: "1rem", fontWeight: 500, margin: 0 }}>{item.name}</h4>
              
              <style>{`
                .category-card:hover {
                  transform: translateY(-5px);
                  box-shadow: var(--shadow-md);
                  color: var(--primary);
                }
              `}</style>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
