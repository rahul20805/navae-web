import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "../admin.module.css";
import { deleteProduct } from "@/actions/admin";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="text-primary">Inventory Management</h1>
        <Link href="/admin/products/new" className="btn btn-primary">Add New Product</Link>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>No products found. Add one above!</td></tr>
            ) : (
              products.map(product => (
                <tr key={product.id}>
                  <td>
                    <div style={{ width: "40px", height: "40px", backgroundColor: "var(--bg-alt)", borderRadius: "4px" }}>
                      {product.images[0] && <img src={product.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} />}
                    </div>
                  </td>
                  <td style={{ fontWeight: "500" }}>{product.name}</td>
                  <td>₹{product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span style={{ padding: "0.25rem 0.5rem", borderRadius: "100px", fontSize: "0.85rem", backgroundColor: product.isAvailable ? "rgba(0,200,0,0.1)" : "rgba(200,0,0,0.1)", color: product.isAvailable ? "green" : "red" }}>
                      {product.isAvailable ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td>
                    <form action={async () => {
                      "use server";
                      await deleteProduct(product.id);
                    }}>
                      <button type="submit" style={{ color: "red", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Delete</button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
