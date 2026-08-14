import { auth } from "@/auth";

export async function checkOwner() {
  const session = await auth();
  if (!session || session.user.role !== "OWNER") {
    throw new Error("Unauthorized: Owner access required.");
  }
}
