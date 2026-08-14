export default function RefundsPage() {
  return (
    <main className="container" style={{ padding: "5rem 1rem", minHeight: "60vh" }}>
      <h1 className="text-primary" style={{ marginBottom: "2rem" }}>Refund Policy</h1>
      
      <div style={{ maxWidth: "800px", lineHeight: "1.8", color: "var(--text-muted)" }}>
        <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
        <br/>
        <h3>1. Physical Products</h3>
        <p>We accept returns for physical products within 7 days of delivery, provided the item is unused and in its original packaging. Custom commissioned art pieces are non-refundable unless damaged during transit.</p>
        
        <br/>
        <h3>2. Damaged Items</h3>
        <p>If your product arrives damaged, please contact us within 48 hours of delivery with photographic evidence. We will arrange for a replacement or a full refund at our discretion.</p>

        <br/>
        <h3>3. Class and Workshop Bookings</h3>
        <p>Class bookings can be cancelled for a full refund up to 48 hours before the scheduled time. Cancellations made within 48 hours of the class are non-refundable, but you may transfer your booking to a friend.</p>

        <br/>
        <h3>4. Processing Refunds</h3>
        <p>Approved refunds will be processed and credited back to your original method of payment within 5-7 business days.</p>

        <br/>
        <h3>5. Contact Us</h3>
        <p>To initiate a return or request a refund, please contact us at:</p>
        <ul>
          <li>Email: anyanant7115@gmail.com</li>
          <li>Phone: +91 7379609531</li>
        </ul>
      </div>
    </main>
  );
}
