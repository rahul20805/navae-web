import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "./admin.module.css";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.adminSidebar}>
        <div className={styles.sidebarHeader}>
          <h2>ANANTA Admin</h2>
        </div>
        <nav className={styles.sidebarNav}>
          <Link href="/admin" className={styles.navItem}>Dashboard</Link>
          <Link href="/admin/products" className={styles.navItem}>Inventory / Shop</Link>
          <Link href="/admin/classes" className={styles.navItem}>Classes / Bookings</Link>
          <Link href="/admin/orders" className={styles.navItem}>Orders</Link>
          <Link href="/admin/enquiries" className={styles.navItem}>Enquiries</Link>
        </nav>
      </aside>
      <main className={styles.adminMain}>
        <header className={styles.adminHeader}>
          <div>Welcome, {session.user.name}</div>
        </header>
        <div className={styles.adminContent}>
          {children}
        </div>
      </main>
    </div>
  );
}
