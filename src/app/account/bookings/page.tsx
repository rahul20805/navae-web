import { getUserBookings } from "@/actions/account";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Bookings | My Account | ANANTA",
};

export default async function AccountBookingsPage() {
  const bookings = await getUserBookings();

  return (
    <div className="card" style={{ padding: "2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
      <h2 style={{ marginBottom: "2rem", borderBottom: "2px solid #f0f0f0", paddingBottom: "1rem", color: "var(--text-main)" }}>My Bookings</h2>
      
      {bookings.length === 0 ? (
        <div className="text-center" style={{ padding: "3rem 0", background: "var(--bg-alt)", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🗓️</div>
          <p className="text-muted" style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>You haven't booked any classes or sessions yet.</p>
          <Link href="/classes" className="btn btn-primary" style={{ padding: "0.8rem 2rem" }}>Browse Classes</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {bookings.map((booking: any) => (
            <div key={booking.id} style={{ border: "1px solid #eaeaea", borderRadius: "var(--radius-md)", padding: "1.5rem", background: "white", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              
              <div>
                <div style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "0.25rem", color: "var(--primary-dark)" }}>
                  {booking.class.title}
                </div>
                <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", display: "flex", gap: "1rem" }}>
                  <span><strong style={{ color: "var(--text-main)" }}>Date:</strong> {new Date(booking.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span><strong style={{ color: "var(--text-main)" }}>Time:</strong> {new Date(booking.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {booking.notes && (
                  <div style={{ fontSize: "0.85rem", marginTop: "0.5rem", padding: "0.5rem", background: "#f9f9f9", borderRadius: "4px", fontStyle: "italic" }}>
                    " {booking.notes} "
                  </div>
                )}
              </div>
              
              <div style={{ textAlign: "right", minWidth: "120px" }}>
                <div style={{ 
                  display: "inline-block", 
                  padding: "0.4rem 1rem", 
                  borderRadius: "2rem", 
                  fontSize: "0.85rem", 
                  fontWeight: "bold", 
                  backgroundColor: booking.status === "CONFIRMED" ? "#e8f5e9" : booking.status === "CANCELLED" ? "#ffebee" : booking.status === "COMPLETED" ? "#e3f2fd" : "#fff3e0", 
                  color: booking.status === "CONFIRMED" ? "#2e7d32" : booking.status === "CANCELLED" ? "#c62828" : booking.status === "COMPLETED" ? "#1565c0" : "#ef6c00"
                }}>
                  {booking.status}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                  Payment: {booking.paymentStatus}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
