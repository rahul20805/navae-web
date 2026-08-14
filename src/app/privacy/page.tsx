export default function PrivacyPage() {
  return (
    <main className="container" style={{ padding: "5rem 1rem", minHeight: "60vh" }}>
      <h1 className="text-primary" style={{ marginBottom: "2rem" }}>Privacy Policy</h1>
      
      <div style={{ maxWidth: "800px", lineHeight: "1.8", color: "var(--text-muted)" }}>
        <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
        <br/>
        <h3>1. Information We Collect</h3>
        <p>We collect information you provide directly to us when you make a purchase, book a class, create an account, or contact us. This may include your name, email address, phone number, shipping address, and payment information.</p>
        
        <br/>
        <h3>2. How We Use Your Information</h3>
        <p>We use the information we collect to process transactions, communicate with you about your orders or bookings, provide customer support, and send you important updates about our services.</p>

        <br/>
        <h3>3. Information Sharing</h3>
        <p>We do not sell or rent your personal information to third parties. We only share information with trusted third-party service providers (like payment processors and shipping partners) strictly necessary to fulfill your orders.</p>

        <br/>
        <h3>4. Data Security</h3>
        <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

        <br/>
        <h3>5. Contact Us</h3>
        <p>If you have questions about this Privacy Policy, please contact us at:</p>
        <ul>
          <li>Email: anyanant7115@gmail.com</li>
          <li>Phone: +91 7379609531</li>
          <li>Address: Varanasi, India</li>
        </ul>
      </div>
    </main>
  );
}
