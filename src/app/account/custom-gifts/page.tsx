import { getMyCustomGiftRequests } from "@/actions/customGift";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Custom Gift Requests | ANANTA",
};

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  NEW: { bg: "#fff3cd", color: "#856404", label: "Received" },
  CONTACTED: { bg: "#d1ecf1", color: "#0c5460", label: "Contacted" },
  QUOTATION_SENT: { bg: "#cce5ff", color: "#004085", label: "Quote Sent" },
  CONFIRMED: { bg: "#d4edda", color: "#155724", label: "Confirmed" },
  COMPLETED: { bg: "#e8f5e9", color: "#1b5e20", label: "Completed ✓" },
  CANCELLED: { bg: "#e2e3e5", color: "#383d41", label: "Cancelled" },
};

export default async function AccountCustomGiftsPage() {
  const requests = await getMyCustomGiftRequests();

  return (
    <div className="card" style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "2px solid #f0f0f0", paddingBottom: "1rem" }}>
        <h2 style={{ margin: 0, color: "var(--text-main)" }}>My Custom Gift Requests</h2>
        <Link href="/custom-gift" className="btn btn-primary" style={{ padding: "0.6rem 1.5rem", fontSize: "0.9rem" }}>+ New Request</Link>
      </div>

      {requests.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 0", background: "var(--bg-alt)", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎁</div>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "1.1rem" }}>No custom gift requests yet.</p>
          <Link href="/custom-gift" className="btn btn-primary" style={{ padding: "0.8rem 2rem" }}>Create Custom Gift</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {requests.map((req) => {
            const statusStyle = STATUS_COLORS[req.status] || STATUS_COLORS.NEW;
            return (
              <div key={req.id} style={{ border: "1px solid #eaeaea", borderRadius: "var(--radius-md)", padding: "1.5rem", background: "white" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "var(--primary-dark)" }}>Request #{req.requestId}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                      Submitted on {new Date(req.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                    </div>
                  </div>
                  <span style={{ padding: "0.35rem 1rem", borderRadius: "2rem", fontSize: "0.85rem", fontWeight: "bold", background: statusStyle.bg, color: statusStyle.color }}>
                    {statusStyle.label}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.75rem", padding: "0.75rem", background: "var(--bg-alt)", borderRadius: "8px" }}>
                  {req.occasion && <div><span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Occasion</span><br /><strong style={{ fontSize: "0.9rem" }}>{req.occasion}</strong></div>}
                  {req.style && <div><span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Style</span><br /><strong style={{ fontSize: "0.9rem" }}>{req.style}</strong></div>}
                  {req.budget && <div><span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Budget</span><br /><strong style={{ fontSize: "0.9rem" }}>{req.budget}</strong></div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
