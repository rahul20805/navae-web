import Link from "next/link";
import styles from "./Footer.module.css";
import { prisma } from "@/lib/prisma";

export default async function Footer() {
  const settingsData = await prisma.setting.findMany();
  const settings = settingsData.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const brandName = settings.businessName || "ANANTA";
  const desc = settings.aboutText || "Create. Learn. Celebrate.\nPremium Indian creative studio for all your artistic needs.";
  const insta = settings.instagramUrl || "https://instagram.com/infiny.pvt";
  const email = settings.emailAddress || "anyanant7115@gmail.com";
  const phone = settings.whatsappNumber || "+91 7379609531";
  const address = settings.physicalAddress || "Varanasi, India";

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div>
          <h3 className={styles.footerBrand}>{brandName}</h3>
          <p className={styles.footerDesc} style={{ whiteSpace: "pre-line" }}>
            {desc.slice(0, 100)}{desc.length > 100 ? "..." : ""}
          </p>
          <div className={styles.socials}>
            <a href={insta} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
        </div>
        
        <div>
          <h4 className={styles.footerHeading}>Quick Links</h4>
          <ul className={styles.footerList}>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
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
            <li>Email: {email}</li>
            <li>Phone: {phone}</li>
            <li>Location: {address}</li>
          </ul>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <div className="container text-center">
          <p>&copy; {new Date().getFullYear()} {brandName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
