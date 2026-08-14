import { prisma } from "@/lib/prisma";
import styles from "../admin.module.css";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      class: true
    }
  });

  return (
    <div>
      <h1 className="text-primary" style={{ marginBottom: "2rem" }}>Class Bookings</h1>

      <div style={{ overflowX: "auto" }}>
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Student</th>
              <th>Class</th>
              <th>Date requested</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "2rem" }}>No bookings yet.</td></tr>
            ) : (
              bookings.map(booking => (
                <tr key={booking.id}>
                  <td style={{ fontSize: "0.85rem", fontFamily: "monospace" }}>{booking.id}</td>
                  <td>
                    <div>{booking.user?.name || "Unknown"}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{booking.user?.email || ""}</div>
                  </td>
                  <td style={{ fontWeight: "500" }}>{booking.class.title}</td>
                  <td>{new Date(booking.date).toLocaleDateString()}</td>
                  <td>
                    <span style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.85rem", backgroundColor: "var(--bg-alt)" }}>
                      {booking.status}
                    </span>
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
