export default function HowItWorks() {
  return (
    <section className="section bg-alt" style={{ padding: "5rem 1rem" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span style={{ color: "var(--primary)", textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "1px", fontWeight: "bold" }}>
            The Process
          </span>
          <h2 style={{ fontSize: "2.5rem", marginTop: "0.5rem" }}>How It Works</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem" }}>
          
          {/* Custom Gifts */}
          <div className="card" style={{ padding: "2.5rem 2rem", textAlign: "center" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "2rem", color: "var(--primary)" }}>For Custom Gifts</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "flex-start", textAlign: "left" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ background: "var(--primary)", color: "white", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>1</div>
                <div>
                  <h4 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>Tell us what you want</h4>
                  <p className="text-muted" style={{ fontSize: "0.9rem" }}>Choose your occasion, recipient, and style.</p>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ background: "var(--primary)", color: "white", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>2</div>
                <div>
                  <h4 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>Share your memories</h4>
                  <p className="text-muted" style={{ fontSize: "0.9rem" }}>Upload photos and personal messages for customization.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ background: "var(--primary)", color: "white", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>3</div>
                <div>
                  <h4 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>Confirm & Create</h4>
                  <p className="text-muted" style={{ fontSize: "0.9rem" }}>Review the details, confirm your order, and we handcraft it.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ background: "var(--primary)", color: "white", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>4</div>
                <div>
                  <h4 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>Delivery / Pickup</h4>
                  <p className="text-muted" style={{ fontSize: "0.9rem" }}>Your personalized creation is safely delivered to your door.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Classes & Services */}
          <div className="card" style={{ padding: "2.5rem 2rem", textAlign: "center" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "2rem", color: "var(--secondary)" }}>For Classes & Services</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem", alignItems: "center" }}>
              <div style={{ padding: "1.5rem", background: "#f8f9fa", width: "100%", borderRadius: "var(--radius-md)", borderLeft: "4px solid var(--secondary)" }}>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>1. Choose</h4>
                <p className="text-muted" style={{ fontSize: "0.9rem", margin: 0 }}>Browse Mehndi, Dance, Art classes, or DIY workshops.</p>
              </div>

              <div style={{ padding: "1.5rem", background: "#f8f9fa", width: "100%", borderRadius: "var(--radius-md)", borderLeft: "4px solid var(--secondary)" }}>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>2. Book</h4>
                <p className="text-muted" style={{ fontSize: "0.9rem", margin: 0 }}>Select your preferred date/time and submit an enquiry.</p>
              </div>

              <div style={{ padding: "1.5rem", background: "#f8f9fa", width: "100%", borderRadius: "var(--radius-md)", borderLeft: "4px solid var(--secondary)" }}>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>3. Confirm & Learn</h4>
                <p className="text-muted" style={{ fontSize: "0.9rem", margin: 0 }}>We confirm your slot. Get ready to experience creativity!</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
