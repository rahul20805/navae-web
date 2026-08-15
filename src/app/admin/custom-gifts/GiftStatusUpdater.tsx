"use client";

import { useState } from "react";
import { updateCustomGiftStatus } from "@/actions/customGift";

const STATUSES = ["NEW", "CONTACTED", "QUOTATION_SENT", "CONFIRMED", "COMPLETED", "CANCELLED"];

export default function GiftStatusUpdater({
  requestId,
  currentStatus,
  currentNotes,
}: {
  requestId: string;
  currentStatus: string;
  currentNotes: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState(currentNotes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const res = await updateCustomGiftStatus(requestId, status, notes);
    setSaving(false);
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
      <h4 style={{ marginBottom: "1rem", fontSize: "1rem" }}>Update Status</h4>
      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "0.95rem", minWidth: "200px" }}
        >
          {STATUSES.map(s => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Admin notes (optional)..."
          style={{ padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid var(--border-color)", flexGrow: 1, fontSize: "0.95rem" }}
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
          style={{ padding: "0.6rem 1.5rem", opacity: saving ? 0.7 : 1 }}
        >
          {saved ? "Saved ✓" : saving ? "Saving..." : "Update"}
        </button>
      </div>
    </div>
  );
}
