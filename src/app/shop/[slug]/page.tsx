import { getProductBySlug } from "@/actions/shop";
import { notFound } from "next/navigation";
import styles from "../page.module.css";
import AddToCart from "@/components/shop/AddToCart";

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="container">
      <div className={styles.detailGrid}>
        <div className={styles.detailImage}>
          {product.images[0] ? (
            <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />
          ) : (
            <span>No Image</span>
          )}
        </div>
        
        <div className={styles.detailInfo}>
          <div className={styles.productCategory}>{product.category?.name || "Uncategorized"}</div>
          <h1>{product.name}</h1>
          <div className={styles.detailPrice}>₹{product.price.toFixed(2)}</div>
          
          <p className={styles.detailDesc}>
            {product.description || "A beautiful handmade creation by ANANTA."}
          </p>

          <div style={{ marginBottom: "2rem" }}>
            <span style={{ color: product.stock > 0 ? "var(--primary)" : "red", fontWeight: "bold" }}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
            </span>
          </div>

          {product.stock > 0 && product.isAvailable && (
            <AddToCart 
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0]
              }} 
            />
          )}
        </div>
      </div>
    </main>
  );
}
