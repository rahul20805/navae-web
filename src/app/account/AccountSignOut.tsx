"use client";
import { signOut } from "next-auth/react";

export default function AccountSignOut() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="btn btn-outline"
      style={{ borderColor: "var(--danger, #dc3545)", color: "var(--danger, #dc3545)" }}
    >
      Sign Out
    </button>
  );
}
