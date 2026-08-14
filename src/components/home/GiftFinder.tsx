"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const questions = [
  {
    id: "recipient",
    title: "Who are you gifting?",
    options: ["Girlfriend", "Boyfriend", "Couple", "Friend", "Family", "Self"],
  },
  {
    id: "occasion",
    title: "What is the occasion?",
    options: ["Birthday", "Anniversary", "Wedding", "Love", "Valentine's", "Just Because"],
  },
  {
    id: "budget",
    title: "What's your budget?",
    options: ["Under ₹500", "₹500 - ₹999", "₹1000+"],
  }
];

export default function GiftFinder() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const handleSelect = (option: string) => {
    const currentQ = questions[step];
    const newAnswers = { ...answers, [currentQ.id]: option };
    setAnswers(newAnswers);
    
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Finish and redirect to shop with params
      const params = new URLSearchParams();
      if (newAnswers.recipient) params.set("recipient", newAnswers.recipient);
      if (newAnswers.occasion) params.set("occasion", newAnswers.occasion);
      router.push(`/shop?${params.toString()}`);
    }
  };

  return (
    <div style={{ background: "var(--primary-dark)", color: "white", padding: "4rem 2rem", borderRadius: "var(--radius-lg)", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", position: "relative", overflow: "hidden" }}>
      
      {/* Decorative background circles */}
      <div style={{ position: "absolute", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", top: "-100px", left: "-100px" }}></div>
      <div style={{ position: "absolute", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", bottom: "-50px", right: "-50px" }}></div>
      
      <div style={{ position: "relative", zIndex: 1, maxWidth: "600px", margin: "0 auto" }}>
        <span style={{ display: "inline-block", background: "rgba(255,255,255,0.1)", padding: "0.25rem 1rem", borderRadius: "2rem", fontSize: "0.85rem", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "1rem" }}>
          Gift Finder
        </span>
        <h2 style={{ fontSize: "2.5rem", marginBottom: "2rem", fontFamily: "var(--font-heading)" }}>
          Find the Perfect Gift
        </h2>

        <div style={{ background: "white", color: "var(--text-main)", padding: "2rem", borderRadius: "var(--radius-md)", boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "2rem" }}>
            {questions.map((_, i) => (
              <div key={i} style={{ width: "30px", height: "4px", background: i <= step ? "var(--primary)" : "#eee", borderRadius: "2px", transition: "background 0.3s" }} />
            ))}
          </div>

          <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>{questions[step].title}</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
            {questions[step].options.map(option => (
              <button 
                key={option}
                onClick={() => handleSelect(option)}
                style={{ 
                  padding: "1rem", 
                  background: "#f8f9fa", 
                  border: "1px solid #eaeaea", 
                  borderRadius: "var(--radius-sm)", 
                  cursor: "pointer", 
                  fontSize: "1rem",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "var(--primary)";
                  e.currentTarget.style.color = "white";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#f8f9fa";
                  e.currentTarget.style.color = "var(--text-main)";
                }}
              >
                {option}
              </button>
            ))}
          </div>
          
          {step > 0 && (
            <button 
              onClick={() => setStep(step - 1)}
              style={{ marginTop: "2rem", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", textDecoration: "underline" }}
            >
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
