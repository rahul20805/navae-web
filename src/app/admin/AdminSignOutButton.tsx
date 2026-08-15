"use client";
import { signOut } from "next-auth/react";

export default function AdminSignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      style={{
        padding: "0.4rem 1rem",
        fontSize: "0.85rem",
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.3)",
        borderRadius: "6px",
        color: "inherit",
        cursor: "pointer",
        transition: "background 0.2s",
      }}
    >
      Sign Out
    </button>
  );
}
