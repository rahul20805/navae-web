import { getProducts } from "@/actions/shop";
import styles from "./page.module.css";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop | ANANTA",
  description: "Browse our collection of handmade art, resin nameplates, and premium crafting materials.",
};

export const revalidate = 60; // Revalidate every minute

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main>
      <section className={styles.shopHero}>
        <div className="container">
          <h1 className="text-primary" style={{ fontSize: "3rem", marginBottom: "1rem" }}>The Art Shop</h1>
          <p className="text-muted" style={{ fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
            Discover unique, handcrafted creations made with love.
          </p>
        </div>
      </section>

      <section className="container">
        {products.length === 0 ? (
          <div style={{ padding: "5rem 0", textAlign: "center" }}>
            <h2>Our shop is currently being restocked!</h2>
            <p className="text-muted">Please check back soon for new handmade items.</p>
          </div>
        ) : (
          <div className={styles.shopGrid}>
            {products.map((product) => (
              <Link href={`/shop/${product.slug}`} key={product.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  {product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>
                <div className={styles.productInfo}>
                  <span className={styles.productCategory}>{product.category?.name || "Uncategorized"}</span>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <div className={styles.productPrice}>₹{product.price.toFixed(2)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
