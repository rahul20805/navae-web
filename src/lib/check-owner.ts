import { auth } from "@/auth";
import { redirect } from "next/navigation";

const OWNER_ROLES = ["OWNER", "SUPER_ADMIN"] as const;

export async function checkOwner() {
  const session = await auth();
  const role = session?.user?.role as string | undefined;
  if (!session || !role || !OWNER_ROLES.includes(role as any)) {
    throw new Error("Unauthorized: Owner access required.");
  }
  return session;
}

export async function requireOwner() {
  const session = await auth();
  const role = session?.user?.role as string | undefined;
  if (!session || !role || !OWNER_ROLES.includes(role as any)) {
    redirect("/login");
  }
  return session;
}

export async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  // Block owners from customer portal
  const role = session.user.role as string | undefined;
  if (role && OWNER_ROLES.includes(role as any)) {
    redirect("/admin");
  }
  return session;
}
