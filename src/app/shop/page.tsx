import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop | ANANTA",
  description: "Browse our premium handmade gifts and creations.",
};

export const revalidate = 60;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const occasion = searchParams.occasion as string;
  const recipient = searchParams.recipient as string;
  const type = searchParams.type as string;
  const custom = searchParams.custom === "true";

  const whereClause: any = { isPublished: true };

  // For a real production app we would map occasion/recipient to category IDs 
  // or add tags to the Product schema. Since we are using standard Categories right now:
  if (occasion) {
    whereClause.category = { slug: occasion };
  } else if (recipient) {
    whereClause.category = { slug: recipient };
  } else if (type) {
    whereClause.category = { slug: type };
  }

  if (custom) {
    whereClause.customization = true;
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  });

  return (
    <main className="bg-alt" style={{ minHeight: "100vh" }}>
      <section className="container section" style={{ paddingTop: "2rem" }}>
        
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "2rem", borderBottom: "1px solid #ddd", paddingBottom: "1rem" }}>
          <div>
            <h1 className="text-primary" style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
              {custom ? "Custom Creations" : "Handmade Shop"}
            </h1>
            <p className="text-muted">Explore our curated collection of beautiful things.</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
          {/* Main Grid */}
          <div>
            {products.length === 0 ? (
              <div className="card text-center" style={{ padding: "4rem 2rem" }}>
                <h3 style={{ marginBottom: "1rem", color: "var(--text-muted)" }}>We're crafting new items...</h3>
                <p>There are no products matching your current selection.</p>
                <Link href="/shop" className="btn btn-outline" style={{ marginTop: "1.5rem" }}>View All Products</Link>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
                {products.map((product) => (
                  <Link href={`/shop/${product.slug}`} key={product.id} className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", backgroundColor: "#f0f0f0" }}>
                      {product.images[0] ? (
                        <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>No image</div>
                      )}
                      {product.customization && (
                        <span style={{ position: "absolute", top: "1rem", left: "1rem", background: "var(--primary)", color: "white", padding: "0.25rem 0.75rem", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: "bold" }}>
                          Customizable
                        </span>
                      )}
                    </div>
                    
                    <div style={{ padding: "1.5rem" }}>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
                        {product.category?.name || "Uncategorized"}
                      </span>
                      <h3 style={{ fontSize: "1.25rem", margin: "0.5rem 0", lineHeight: 1.3 }}>{product.name}</h3>
                      
                      <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginTop: "1rem" }}>
                        <span style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--primary)" }}>
                          ₹{product.discountPrice || product.price}
                        </span>
                        {product.discountPrice && (
                          <span style={{ fontSize: "0.95rem", color: "var(--text-muted)", textDecoration: "line-through" }}>
                            ₹{product.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
