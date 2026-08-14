import { prisma } from "@/lib/prisma";
import styles from "../admin.module.css";

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-primary" style={{ marginBottom: "2rem" }}>Customer Enquiries</h1>

      <div style={{ overflowX: "auto" }}>
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Message</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>No enquiries yet.</td></tr>
            ) : (
              enquiries.map(enq => (
                <tr key={enq.id}>
                  <td>{new Date(enq.createdAt).toLocaleDateString()}</td>
                  <td style={{ fontWeight: "500" }}>{enq.type}</td>
                  <td>{enq.name}</td>
                  <td>
                    <div>{enq.email}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{enq.phone || "No phone"}</div>
                  </td>
                  <td style={{ maxWidth: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {enq.message}
                  </td>
                  <td>
                    <span style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.85rem", backgroundColor: "var(--bg-alt)" }}>
                      {enq.status}
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
