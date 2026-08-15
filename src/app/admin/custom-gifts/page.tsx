import { getCustomGiftRequests, updateCustomGiftStatus } from "@/actions/customGift";
import { Metadata } from "next";
import GiftStatusUpdater from "./GiftStatusUpdater";

export const metadata: Metadata = {
  title: "Custom Gift Requests | Admin | ANANTA",
};

export const revalidate = 0;

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  NEW: { bg: "#fff3cd", color: "#856404" },
  CONTACTED: { bg: "#d1ecf1", color: "#0c5460" },
  QUOTATION_SENT: { bg: "#cce5ff", color: "#004085" },
  CONFIRMED: { bg: "#d4edda", color: "#155724" },
  COMPLETED: { bg: "#f8d7da", color: "#721c24" },
  CANCELLED: { bg: "#e2e3e5", color: "#383d41" },
};

export default async function AdminCustomGiftsPage() {
  const requests = await getCustomGiftRequests();
  const newCount = requests.filter(r => r.status === "NEW").length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ margin: 0 }}>Custom Gift Requests</h1>
          {newCount > 0 && (
            <p style={{ color: "var(--primary)", fontWeight: "bold", marginTop: "0.5rem" }}>
              🔔 {newCount} New Request{newCount > 1 ? "s" : ""} awaiting response
            </p>
          )}
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="card" style={{ padding: "4rem", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎁</div>
          <h2 style={{ color: "var(--text-muted)" }}>No custom gift requests yet</h2>
          <p style={{ color: "var(--text-muted)" }}>When customers submit custom requests, they will appear here.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {requests.map((req) => {
            const statusStyle = STATUS_COLORS[req.status] || STATUS_COLORS.NEW;
            return (
              <div key={req.id} className="card" style={{ padding: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                      <h2 style={{ margin: 0, fontSize: "1.2rem" }}>{req.name}</h2>
                      <span style={{ padding: "0.3rem 0.75rem", borderRadius: "2rem", fontSize: "0.8rem", fontWeight: "bold", background: statusStyle.bg, color: statusStyle.color }}>
                        {req.status.replace("_", " ")}
                      </span>
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                      <span style={{ marginRight: "1.5rem" }}>📧 {req.email}</span>
                      {req.phone && <span>📱 {req.phone}</span>}
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                      Request ID: <strong style={{ color: "var(--primary)" }}>{req.requestId}</strong> — {new Date(req.createdAt).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", padding: "1rem", background: "var(--bg-alt)", borderRadius: "8px", marginBottom: "1.5rem" }}>
                  {req.occasion && <div><span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Occasion</span><br /><strong>{req.occasion}</strong></div>}
                  {req.recipient && <div><span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Recipient</span><br /><strong>{req.recipient}</strong></div>}
                  {req.style && <div><span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Style</span><br /><strong>{req.style}</strong></div>}
                  {req.budget && <div><span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Budget</span><br /><strong>{req.budget}</strong></div>}
                </div>

                {(req.message || req.specialInstructions) && (
                  <div style={{ marginBottom: "1.5rem" }}>
                    {req.message && <div style={{ marginBottom: "0.75rem" }}><strong style={{ fontSize: "0.9rem" }}>Message:</strong><br /><em style={{ color: "var(--text-muted)" }}>"{req.message}"</em></div>}
                    {req.specialInstructions && <div><strong style={{ fontSize: "0.9rem" }}>Instructions:</strong><br /><span style={{ color: "var(--text-muted)" }}>{req.specialInstructions}</span></div>}
                  </div>
                )}

                <GiftStatusUpdater requestId={req.id} currentStatus={req.status} currentNotes={req.adminNotes || ""} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
