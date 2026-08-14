export default function TermsPage() {
  return (
    <main className="container" style={{ padding: "5rem 1rem", minHeight: "60vh" }}>
      <h1 className="text-primary" style={{ marginBottom: "2rem" }}>Terms of Service</h1>
      
      <div style={{ maxWidth: "800px", lineHeight: "1.8", color: "var(--text-muted)" }}>
        <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
        <br/>
        <h3>1. Agreement to Terms</h3>
        <p>By accessing and using ANANTA (Infiny Pvt) services, website, or purchasing products, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our services.</p>
        
        <br/>
        <h3>2. Products and Services</h3>
        <p>We reserve the right to modify or discontinue any product or service without notice. Prices for all products are subject to change without notice. Custom art orders are subject to specific agreements and timeline estimates provided at the time of order.</p>

        <br/>
        <h3>3. Class Bookings</h3>
        <p>Class bookings are confirmed only upon receipt of full payment. We reserve the right to cancel or reschedule classes due to unforeseen circumstances, in which case a full refund or alternative date will be offered.</p>

        <br/>
        <h3>4. Intellectual Property</h3>
        <p>The Service and its original content (including art designs, images, and course materials) are and will remain the exclusive property of ANANTA and its licensors.</p>

        <br/>
        <h3>5. Contact Information</h3>
        <p>For any questions regarding these Terms, please contact us at:</p>
        <ul>
          <li>Email: anyanant7115@gmail.com</li>
          <li>Phone: +91 7379609531</li>
          <li>Address: Varanasi, India</li>
        </ul>
      </div>
    </main>
  );
}
