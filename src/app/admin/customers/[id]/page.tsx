"use client";

import { useState, useEffect } from "react";
import { getCustomerProfile, sendCustomerEmail } from "@/actions/customers";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CustomerProfilePage() {
  const params = useParams();
  const id = params.id as string;
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Email Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [sending, setSending] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [id]);

  async function loadProfile() {
    setLoading(true);
    const data = await getCustomerProfile(id);
    setProfile(data);
    setLoading(false);
  }

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setEmailError("");
    setEmailSuccess(false);

    const res = await sendCustomerEmail(profile.id, profile.email, emailSubject, emailContent);
    if (res.success) {
      setEmailSuccess(true);
      setEmailSubject("");
      setEmailContent("");
      // Reload profile to see new email in history
      await loadProfile();
      setTimeout(() => {
        setIsModalOpen(false);
        setEmailSuccess(false);
      }, 2000);
    } else {
      setEmailError(res.error || "Failed to send email.");
    }
    setSending(false);
  }

  if (loading) return <div style={{ padding: "3rem", textAlign: "center" }}>Loading customer profile...</div>;
  if (!profile) return <div style={{ padding: "3rem", textAlign: "center" }}>Customer not found.</div>;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <Link href="/admin/customers" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem", marginBottom: "0.5rem", display: "inline-block" }}>
            ← Back to Customers
          </Link>
          <h1 className="text-primary">{profile.name || "Unknown Customer"}</h1>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>{profile.email} • {profile.phone || "No phone"}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ background: "var(--primary)", color: "white", padding: "0.75rem 1.5rem", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
        >
          Send Email / Reminder
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Total Spent</div>
          <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "var(--primary-dark)" }}>₹{profile.totalSpent.toFixed(2)}</div>
        </div>
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Total Orders</div>
          <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "var(--primary-dark)" }}>{profile.orders.length}</div>
        </div>
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Joined Date</div>
          <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "var(--text-main)", marginTop: "0.5rem" }}>{new Date(profile.createdAt).toLocaleDateString()}</div>
        </div>
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Role</div>
          <span style={{ 
            display: "inline-block", padding: "0.25rem 0.75rem", borderRadius: "20px", marginTop: "0.5rem",
            background: profile.role === "OWNER" || profile.role === "SUPER_ADMIN" ? "#ffebee" : "#e8f5e9",
            color: profile.role === "OWNER" || profile.role === "SUPER_ADMIN" ? "#c62828" : "#2e7d32", 
            fontWeight: "600"
          }}>
            {profile.role}
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        {/* Left Column: Orders & History */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* Order History */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "var(--primary-dark)" }}>Order History</h2>
            {profile.orders.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No orders placed yet.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                    <th style={{ padding: "0.75rem" }}>Order ID</th>
                    <th style={{ padding: "0.75rem" }}>Date</th>
                    <th style={{ padding: "0.75rem" }}>Status</th>
                    <th style={{ padding: "0.75rem", textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.orders.map((o: any) => (
                    <tr key={o.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "0.75rem", fontSize: "0.9rem" }}><Link href={`/admin/orders`}>{o.id.slice(-8).toUpperCase()}</Link></td>
                      <td style={{ padding: "0.75rem", fontSize: "0.9rem" }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: "0.75rem" }}>
                        <span style={{ fontSize: "0.8rem", padding: "0.2rem 0.5rem", background: "#eee", borderRadius: "4px" }}>{o.status}</span>
                      </td>
                      <td style={{ padding: "0.75rem", textAlign: "right", fontWeight: "600" }}>₹{o.totalAmount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Email History */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "var(--primary-dark)" }}>Email & Notification History</h2>
            {profile.emails.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No emails sent to this customer.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {profile.emails.map((email: any) => (
                  <div key={email.id} style={{ borderLeft: "4px solid var(--primary)", padding: "1rem", background: "var(--bg-alt)", borderRadius: "0 8px 8px 0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <strong style={{ fontSize: "1rem" }}>{email.subject}</strong>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{new Date(email.sentAt).toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "var(--text-main)", whiteSpace: "pre-wrap" }}>
                      {email.content}
                    </div>
                    <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", fontWeight: "600", color: email.status === "FAILED" ? "var(--error)" : (email.status === "MOCKED" ? "#f57c00" : "var(--success)") }}>
                      Status: {email.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Address, Frequent Products, etc */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          <div className="card" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "var(--primary-dark)" }}>Customer Details</h2>
            <div style={{ marginBottom: "1rem" }}>
              <strong style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Primary Address</strong>
              <div style={{ fontSize: "0.95rem", whiteSpace: "pre-wrap" }}>{profile.address || "No address provided."}</div>
            </div>
            {profile.orders.length > 0 && profile.orders[0].shippingAddress && (
              <div>
                <strong style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Last Shipping Address</strong>
                <div style={{ fontSize: "0.95rem", whiteSpace: "pre-wrap" }}>{profile.orders[0].shippingAddress}</div>
              </div>
            )}
          </div>

          <div className="card" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "var(--primary-dark)" }}>Frequently Ordered Products</h2>
            {profile.frequentProducts.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No products ordered yet.</p>
            ) : (
              <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {profile.frequentProducts.map((fp: any, idx: number) => (
                  <li key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                    <span>{fp.name}</span>
                    <span style={{ fontWeight: "600", color: "var(--primary)" }}>x{fp.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>

      {/* Email Modal */}
      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div className="card" style={{ padding: "2rem", width: "100%", maxWidth: "600px", background: "white", position: "relative" }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-muted)" }}
            >
              &times;
            </button>
            <h2 style={{ marginBottom: "0.5rem", color: "var(--primary-dark)" }}>Send Email to {profile.name}</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>Send a personalized message or reminder directly to {profile.email}.</p>
            
            <form onSubmit={handleSendEmail} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Subject</label>
                <input 
                  type="text" 
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  required
                  placeholder="e.g. Update on your recent custom art order"
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "8px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Message</label>
                <textarea 
                  value={emailContent}
                  onChange={e => setEmailContent(e.target.value)}
                  required
                  rows={8}
                  placeholder={`Hi ${profile.name},\n\nWe wanted to let you know...`}
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "8px", resize: "vertical" }}
                />
              </div>
              
              {emailError && <div style={{ color: "var(--error)", fontSize: "0.9rem" }}>{emailError}</div>}
              {emailSuccess && <div style={{ color: "var(--success)", fontSize: "0.9rem", fontWeight: "600" }}>Email sent and logged successfully!</div>}
              
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: "0.75rem 1.5rem", border: "1px solid #ddd", background: "white", borderRadius: "8px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={sending || emailSuccess}
                  style={{ padding: "0.75rem 1.5rem", border: "none", background: "var(--primary)", color: "white", borderRadius: "8px", cursor: sending ? "not-allowed" : "pointer", fontWeight: "600" }}
                >
                  {sending ? "Sending..." : "Send Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
