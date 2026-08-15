import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProductCustomizer from "@/components/shop/ProductCustomizer";
import ReviewSection from "@/components/shop/ReviewSection";
import Link from "next/link";
import { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  return {
    title: product ? `${product.name} | ANANTA` : "Product Not Found",
    description: product?.description || "Handmade with love.",
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { 
      category: true,
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!product || !product.isPublished) {
    notFound();
  }

  return (
    <main className="container section">
      <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", marginBottom: "2rem" }}>
        ← Back to Shop
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "4rem" }}>
        {/* Left: Image Gallery */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", borderRadius: "var(--radius-lg)", overflow: "hidden", backgroundColor: "#f0f0f0" }}>
            {product.images[0] ? (
              <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: "cover" }} priority />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>No image available</div>
            )}
          </div>
          
          {product.images.length > 1 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
              {product.images.slice(1).map((img: string, i: number) => (
                <div key={i} style={{ position: "relative", aspectRatio: "1/1", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                  <Image src={img} alt={`${product.name} ${i+2}`} fill style={{ objectFit: "cover" }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div>
          <span style={{ color: "var(--primary)", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "1px", fontWeight: "bold" }}>
            {product.category?.name || "Handmade"}
          </span>
          <h1 style={{ fontSize: "2.5rem", marginTop: "0.5rem", marginBottom: "1rem" }}>{product.name}</h1>
          
          <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "2rem" }}>
            <span style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--text-main)" }}>
              ₹{product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <span style={{ fontSize: "1.25rem", color: "var(--text-muted)", textDecoration: "line-through" }}>
                ₹{product.price}
              </span>
            )}
          </div>

          <div style={{ color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "2rem" }}>
            {product.description || "No description provided."}
          </div>

          <div style={{ padding: "1rem", background: product.stock > 0 ? "#f8fff9" : "#fff8f8", borderRadius: "var(--radius-sm)", color: product.stock > 0 ? "#2e5a4b" : "#dc3545", marginBottom: "1rem" }}>
            {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : "✗ Currently Out of Stock"}
          </div>

          {product.stock > 0 && product.isAvailable && (
            <ProductCustomizer 
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                discountPrice: product.discountPrice,
                image: product.images[0] || "",
                customization: product.customization
              }} 
            />
          )}

          <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #eee" }}>
            <h4 style={{ marginBottom: "1rem" }}>Production & Delivery</h4>
            <ul style={{ color: "var(--text-muted)", paddingLeft: "1.2rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <li>Handmade to order specifically for you.</li>
              <li>Standard production time is 3-5 business days.</li>
              <li>Securely packaged for safe transit across India.</li>
            </ul>
          </div>
        </div>
      </div>

      <ReviewSection productId={product.id} reviews={product.reviews} />
    </main>
  );
}
