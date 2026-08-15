"use client";

import { useState } from "react";
import { submitCustomGiftRequest } from "@/actions/customGift";
import { useSession } from "next-auth/react";

type Step = { id: number; title: string };

const STEPS: Step[] = [
  { id: 1, title: "Occasion" },
  { id: 2, title: "Recipient" },
  { id: 3, title: "Style" },
  { id: 4, title: "Budget" },
  { id: 5, title: "Personalize" },
  { id: 6, title: "Review" }
];

const STATUS_COLORS: Record<string, string> = {
  NEW: "#6c757d",
  CONTACTED: "#17a2b8",
  QUOTATION_SENT: "#ffc107",
  CONFIRMED: "#28a745",
  COMPLETED: "#9C4B3C",
  CANCELLED: "#dc3545",
};

export default function CustomGiftPage() {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: (session?.user?.name) || "",
    email: (session?.user?.email) || "",
    phone: "",
    occasion: "",
    recipient: "",
    style: "",
    budget: "",
    message: "",
    specialInstructions: ""
  });

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const handleSelect = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTimeout(handleNext, 300);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      setError("Please fill in your name and email before submitting.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await submitCustomGiftRequest(formData);
      if (res.success) {
        setRequestId(res.requestId!);
        setSubmitted(true);
      } else {
        setError(res.error || "Failed to submit. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-main)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div className="card" style={{ padding: "3rem", maxWidth: "600px", width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🎁</div>
          <h1 style={{ color: "var(--primary)", marginBottom: "1rem" }}>Request Submitted!</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: "2rem" }}>
            We've received your custom gift request. Our team will contact you within 24 hours.
          </p>
          <div style={{ background: "var(--bg-alt)", borderRadius: "var(--radius-md)", padding: "1.5rem", marginBottom: "2rem" }}>
            <p style={{ marginBottom: "0.5rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>Your Request ID</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary-dark)", letterSpacing: "2px" }}>{requestId}</p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>Save this for tracking your order status</p>
          </div>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/shop" className="btn btn-primary" style={{ padding: "0.8rem 2rem" }}>Browse Shop</a>
            {session?.user && (
              <a href="/account" className="btn btn-outline" style={{ padding: "0.8rem 2rem" }}>Track in My Account</a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-main)", paddingTop: "80px", paddingBottom: "4rem" }}>
      <div className="container" style={{ maxWidth: "900px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ color: "var(--primary)", marginBottom: "1rem" }}>Create Your Custom Gift</h1>
          <p className="text-muted" style={{ fontSize: "1.1rem" }}>Let us craft something perfectly unique for your special moment.</p>
        </div>

        {/* Progress Indicator */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4rem", position: "relative" }}>
          <div style={{ position: "absolute", top: "18px", left: 0, right: 0, height: "2px", background: "var(--border-color)", zIndex: 1 }}></div>
          <div style={{ position: "absolute", top: "18px", left: 0, width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`, height: "2px", background: "var(--primary)", zIndex: 2, transition: "width 0.4s ease" }}></div>
          {STEPS.map((step) => (
            <div key={step.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", zIndex: 3 }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: step.id <= currentStep ? "var(--primary)" : "var(--bg-surface)",
                color: step.id <= currentStep ? "white" : "var(--text-muted)",
                border: `2px solid ${step.id <= currentStep ? "var(--primary)" : "var(--border-color)"}`,
                fontWeight: "bold", transition: "all 0.3s ease"
              }}>
                {step.id < currentStep ? "✓" : step.id}
              </div>
              <span style={{ fontSize: "0.8rem", fontWeight: 500, color: step.id <= currentStep ? "var(--primary-dark)" : "var(--text-muted)" }}>{step.title}</span>
            </div>
          ))}
        </div>

        <div style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-xl)", padding: "3rem", boxShadow: "var(--shadow-lg)", minHeight: "350px", border: "1px solid var(--border-color)" }}>
          
          {/* Step 1: Occasion */}
          {currentStep === 1 && (
            <div>
              <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "var(--primary-dark)" }}>What's the occasion?</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
                {["Birthday", "Anniversary", "Wedding", "Housewarming", "Just Because", "Other"].map(occ => (
                  <button key={occ} onClick={() => handleSelect("occasion", occ)} style={{
                    padding: "1.2rem", borderRadius: "var(--radius-md)", border: `2px solid ${formData.occasion === occ ? "var(--primary)" : "var(--border-color)"}`,
                    background: formData.occasion === occ ? "var(--bg-alt)" : "transparent",
                    fontSize: "1rem", fontWeight: 500, cursor: "pointer", transition: "all 0.2s", color: "var(--text-main)"
                  }}>{occ}</button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Recipient */}
          {currentStep === 2 && (
            <div>
              <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "var(--primary-dark)" }}>Who is this for?</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
                {["Partner", "Parent", "Friend", "Colleague", "Child", "Myself"].map(rec => (
                  <button key={rec} onClick={() => handleSelect("recipient", rec)} style={{
                    padding: "1.2rem", borderRadius: "var(--radius-md)", border: `2px solid ${formData.recipient === rec ? "var(--primary)" : "var(--border-color)"}`,
                    background: formData.recipient === rec ? "var(--bg-alt)" : "transparent",
                    fontSize: "1rem", fontWeight: 500, cursor: "pointer", transition: "all 0.2s", color: "var(--text-main)"
                  }}>{rec}</button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Style */}
          {currentStep === 3 && (
            <div>
              <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "var(--primary-dark)" }}>Choose a style</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
                {["Resin Art", "Scrapbook", "Explosion Box", "Portrait", "Hamper", "Surprise Me"].map(style => (
                  <button key={style} onClick={() => handleSelect("style", style)} style={{
                    padding: "1.2rem", borderRadius: "var(--radius-md)", border: `2px solid ${formData.style === style ? "var(--primary)" : "var(--border-color)"}`,
                    background: formData.style === style ? "var(--bg-alt)" : "transparent",
                    fontSize: "1rem", fontWeight: 500, cursor: "pointer", transition: "all 0.2s", color: "var(--text-main)"
                  }}>{style}</button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Budget */}
          {currentStep === 4 && (
            <div>
              <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "var(--primary-dark)" }}>What's your budget?</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                {["Under ₹1000", "₹1000 - ₹2500", "₹2500 - ₹5000", "Above ₹5000"].map(budget => (
                  <button key={budget} onClick={() => handleSelect("budget", budget)} style={{
                    padding: "1.5rem", borderRadius: "var(--radius-md)", border: `2px solid ${formData.budget === budget ? "var(--primary)" : "var(--border-color)"}`,
                    background: formData.budget === budget ? "var(--bg-alt)" : "transparent",
                    fontSize: "1.1rem", fontWeight: 500, cursor: "pointer", transition: "all 0.2s", color: "var(--text-main)"
                  }}>{budget}</button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Contact & Personalization */}
          {currentStep === 5 && (
            <div>
              <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "var(--primary-dark)" }}>Your Details</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, color: "var(--text-main)", fontSize: "0.95rem" }}>Full Name *</label>
                    <input type="text" className="input-field" required value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Your full name" />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, color: "var(--text-main)", fontSize: "0.95rem" }}>Email *</label>
                    <input type="email" className="input-field" required value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, color: "var(--text-main)", fontSize: "0.95rem" }}>Phone Number</label>
                  <input type="tel" className="input-field" value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, color: "var(--text-main)", fontSize: "0.95rem" }}>Personal Message to include</label>
                  <textarea className="input-field" rows={2} placeholder="E.g., Happy 5th Anniversary! Love you always."
                    value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, color: "var(--text-main)", fontSize: "0.95rem" }}>Special Instructions for the artist</label>
                  <textarea className="input-field" rows={2} placeholder="Colors, themes, or special requests..."
                    value={formData.specialInstructions} onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
                  <button onClick={handleBack} style={{ color: "var(--text-muted)", fontWeight: 500, border: "none", background: "none", cursor: "pointer" }}>← Back</button>
                  <button className="btn btn-primary" onClick={handleNext} style={{ padding: "0.8rem 2rem" }}>Continue to Review →</button>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Review & Submit */}
          {currentStep === 6 && (
            <div>
              <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "var(--primary-dark)" }}>Review Your Request</h2>
              <div style={{ background: "var(--bg-alt)", borderRadius: "var(--radius-md)", padding: "2rem", marginBottom: "2rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" }}>
                  <div><span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Name:</span><br /><strong>{formData.name || "—"}</strong></div>
                  <div><span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Email:</span><br /><strong>{formData.email || "—"}</strong></div>
                  <div><span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Occasion:</span><br /><strong>{formData.occasion || "Not specified"}</strong></div>
                  <div><span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Recipient:</span><br /><strong>{formData.recipient || "Not specified"}</strong></div>
                  <div><span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Style:</span><br /><strong>{formData.style || "Not specified"}</strong></div>
                  <div><span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Budget:</span><br /><strong>{formData.budget || "Not specified"}</strong></div>
                </div>
                {(formData.message || formData.specialInstructions) && (
                  <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-color)" }}>
                    {formData.message && <div style={{ marginBottom: "0.75rem" }}><span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Message:</span><br /><em>"{formData.message}"</em></div>}
                    {formData.specialInstructions && <div><span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Instructions:</span><br />{formData.specialInstructions}</div>}
                  </div>
                )}
              </div>
              {error && <div style={{ padding: "1rem", background: "#ffebee", borderRadius: "8px", color: "#c62828", marginBottom: "1.5rem", fontWeight: 500 }}>{error}</div>}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button onClick={handleBack} style={{ color: "var(--text-muted)", fontWeight: 500, border: "none", background: "none", cursor: "pointer" }}>← Edit Details</button>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}
                  style={{ padding: "1rem 3rem", fontSize: "1.1rem", opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? "Submitting..." : "Submit Request 🎁"}
                </button>
              </div>
            </div>
          )}

          {/* Back nav for steps 2-4 */}
          {currentStep > 1 && currentStep < 5 && (
            <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "2rem" }}>
              <button onClick={handleBack} style={{ color: "var(--text-muted)", fontWeight: 500, border: "none", background: "none", cursor: "pointer" }}>← Back</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
