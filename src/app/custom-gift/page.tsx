"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Step = {
  id: number;
  title: string;
};

const STEPS: Step[] = [
  { id: 1, title: "Occasion" },
  { id: 2, title: "Recipient" },
  { id: 3, title: "Style" },
  { id: 4, title: "Budget" },
  { id: 5, title: "Personalize" },
  { id: 6, title: "Review" }
];

export default function CustomGiftPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
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
    setTimeout(handleNext, 300); // Auto-advance after selection
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-main)", paddingTop: "80px", paddingBottom: "4rem" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ color: "var(--primary)", marginBottom: "1rem" }}>Create Your Custom Gift</h1>
          <p className="text-muted" style={{ fontSize: "1.1rem" }}>Let us craft something perfectly unique for your special moment.</p>
        </div>

        {/* Progress Indicator */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4rem", position: "relative" }}>
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "2px", background: "var(--border-color)", zIndex: 1, transform: "translateY(-50%)" }}></div>
          <div style={{ position: "absolute", top: "50%", left: 0, width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`, height: "2px", background: "var(--primary)", zIndex: 2, transform: "translateY(-50%)", transition: "width 0.4s ease" }}></div>
          
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
              <span style={{ fontSize: "0.85rem", fontWeight: 500, color: step.id <= currentStep ? "var(--primary-dark)" : "var(--text-muted)" }}>{step.title}</span>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-xl)", padding: "3rem", boxShadow: "var(--shadow-lg)", minHeight: "400px", border: "1px solid var(--border-color)" }}>
          
          {/* Step 1: Occasion */}
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "var(--primary-dark)" }}>What's the occasion?</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
                {["Birthday", "Anniversary", "Wedding", "Housewarming", "Just Because", "Other"].map(occ => (
                  <button 
                    key={occ} 
                    onClick={() => handleSelect("occasion", occ)}
                    style={{ 
                      padding: "1.5rem", borderRadius: "var(--radius-md)", border: `2px solid ${formData.occasion === occ ? "var(--primary)" : "var(--border-color)"}`,
                      background: formData.occasion === occ ? "var(--bg-main)" : "transparent",
                      fontSize: "1.1rem", fontWeight: 500, cursor: "pointer", transition: "all 0.2s ease",
                      color: "var(--text-main)"
                    }}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Recipient */}
          {currentStep === 2 && (
            <div className="animate-fade-in">
              <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "var(--primary-dark)" }}>Who is this for?</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
                {["Partner", "Parent", "Friend", "Colleague", "Child", "Myself"].map(rec => (
                  <button 
                    key={rec} 
                    onClick={() => handleSelect("recipient", rec)}
                    style={{ 
                      padding: "1.5rem", borderRadius: "var(--radius-md)", border: `2px solid ${formData.recipient === rec ? "var(--primary)" : "var(--border-color)"}`,
                      background: formData.recipient === rec ? "var(--bg-main)" : "transparent",
                      fontSize: "1.1rem", fontWeight: 500, cursor: "pointer", transition: "all 0.2s ease",
                      color: "var(--text-main)"
                    }}
                  >
                    {rec}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Style */}
          {currentStep === 3 && (
            <div className="animate-fade-in">
              <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "var(--primary-dark)" }}>Choose a style</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
                {["Resin Art", "Scrapbook", "Explosion Box", "Portrait", "Hamper", "Surprise Me"].map(style => (
                  <button 
                    key={style} 
                    onClick={() => handleSelect("style", style)}
                    style={{ 
                      padding: "1.5rem", borderRadius: "var(--radius-md)", border: `2px solid ${formData.style === style ? "var(--primary)" : "var(--border-color)"}`,
                      background: formData.style === style ? "var(--bg-main)" : "transparent",
                      fontSize: "1.1rem", fontWeight: 500, cursor: "pointer", transition: "all 0.2s ease",
                      color: "var(--text-main)"
                    }}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Budget */}
          {currentStep === 4 && (
            <div className="animate-fade-in">
              <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "var(--primary-dark)" }}>What's your budget range?</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
                {["Under ₹1000", "₹1000 - ₹2500", "₹2500 - ₹5000", "Above ₹5000"].map(budget => (
                  <button 
                    key={budget} 
                    onClick={() => handleSelect("budget", budget)}
                    style={{ 
                      padding: "1.5rem", borderRadius: "var(--radius-md)", border: `2px solid ${formData.budget === budget ? "var(--primary)" : "var(--border-color)"}`,
                      background: formData.budget === budget ? "var(--bg-main)" : "transparent",
                      fontSize: "1.1rem", fontWeight: 500, cursor: "pointer", transition: "all 0.2s ease",
                      color: "var(--text-main)"
                    }}
                  >
                    {budget}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Personalization */}
          {currentStep === 5 && (
            <div className="animate-fade-in">
              <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "var(--primary-dark)" }}>Personal Details</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Personal Message to include (optional)</label>
                  <textarea 
                    className="input-field" 
                    rows={3} 
                    placeholder="E.g., Happy 5th Anniversary! Love you always."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Special instructions for the artist</label>
                  <textarea 
                    className="input-field" 
                    rows={3} 
                    placeholder="E.g., Please use pastel colors, they love butterflies..."
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})}
                  ></textarea>
                </div>
                <button className="btn btn-primary" onClick={handleNext} style={{ alignSelf: "flex-end", marginTop: "1rem" }}>Continue to Review</button>
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {currentStep === 6 && (
            <div className="animate-fade-in">
              <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "var(--primary-dark)" }}>Review Your Request</h2>
              <div style={{ background: "var(--bg-main)", borderRadius: "var(--radius-md)", padding: "2rem", marginBottom: "2rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div><span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Occasion:</span><br/><strong>{formData.occasion || "Not specified"}</strong></div>
                  <div><span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Recipient:</span><br/><strong>{formData.recipient || "Not specified"}</strong></div>
                  <div><span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Style:</span><br/><strong>{formData.style || "Not specified"}</strong></div>
                  <div><span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Budget:</span><br/><strong>{formData.budget || "Not specified"}</strong></div>
                </div>
                {(formData.message || formData.specialInstructions) && (
                  <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-color)" }}>
                    {formData.message && <div style={{ marginBottom: "1rem" }}><span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Message:</span><br/><i>"{formData.message}"</i></div>}
                    {formData.specialInstructions && <div><span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Instructions:</span><br/>{formData.specialInstructions}</div>}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button className="btn btn-primary" style={{ padding: "1rem 4rem", fontSize: "1.1rem" }}>Submit Request</button>
              </div>
            </div>
          )}

          {/* Navigation Controls (Only show on intermediate steps) */}
          {currentStep > 1 && currentStep < 6 && currentStep !== 5 && (
            <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "3rem" }}>
              <button onClick={handleBack} style={{ color: "var(--text-muted)", fontWeight: 500, border: "none", background: "none", cursor: "pointer" }}>← Back</button>
            </div>
          )}
          {currentStep === 5 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
              <button onClick={handleBack} style={{ color: "var(--text-muted)", fontWeight: 500, border: "none", background: "none", cursor: "pointer" }}>← Back</button>
            </div>
          )}
          {currentStep === 6 && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
               <button onClick={handleBack} style={{ color: "var(--text-muted)", fontWeight: 500, border: "none", background: "none", cursor: "pointer" }}>← Edit Details</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
