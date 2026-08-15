"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getUserBookings() {
  const session = await auth();
  if (!session?.user) return [];

  return prisma.booking.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    include: { class: true }
  });
}

export async function updateUserProfile(data: { name: string, phone: string, address: string }) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        phone: data.phone,
        address: data.address
      }
    });

    revalidatePath("/account");
    revalidatePath("/account/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}
