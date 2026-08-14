import type { Metadata } from "next";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "ANANTA | Create. Learn. Celebrate.",
  description: "Premium Indian creative studio offering Mehndi design, art & craft, dance tuition, DIY projects, custom products, and workshops.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
          <MobileNav />
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}

