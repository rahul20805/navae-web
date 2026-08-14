import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div>
          <h3 className={styles.footerBrand}>NAVAÉ Art & Craft</h3>
          <p className={styles.footerDesc}>
            Create. Learn. Celebrate.<br/>
            Premium Indian creative studio for all your artistic needs.
          </p>
          <div className={styles.socials}>
            <a href="https://instagram.com/navae.in" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
        </div>
        
        <div>
          <h4 className={styles.footerHeading}>Quick Links</h4>
          <ul className={styles.footerList}>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            <li><Link href="/classes">Classes & Tuition</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className={styles.footerHeading}>Legal</h4>
          <ul className={styles.footerList}>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
            <li><Link href="/refunds">Refund Policy</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className={styles.footerHeading}>Contact</h4>
          <ul className={styles.footerList}>
            <li>Email: hello@navae.in</li>
            <li>Location: India</li>
          </ul>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <div className="container text-center">
          <p>&copy; {new Date().getFullYear()} NAVAÉ Art & Craft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
