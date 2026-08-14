import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        <Link href="/" className={styles.logo}>
          ANANTA
        </Link>
        <nav className={styles.nav}>
          <Link href="/about" className={styles.navLink}>About</Link>
          <Link href="/services" className={styles.navLink}>Services</Link>
          <Link href="/shop" className={styles.navLink}>Shop</Link>
          <Link href="/classes" className={styles.navLink}>Classes</Link>
          <Link href="/contact" className={styles.navLink}>Contact</Link>
        </nav>
        <div className={styles.actions}>
          <Link href="/login" className="btn btn-secondary" style={{ padding: "0.5rem 1rem" }}>
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
