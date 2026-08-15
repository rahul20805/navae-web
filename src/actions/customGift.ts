"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

function generateRequestId(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 900) + 100;
  const ts = Date.now().toString().slice(-4);
  return `GIFT-${year}-${rand}${ts}`;
}

export async function submitCustomGiftRequest(data: {
  name: string;
  email: string;
  phone: string;
  occasion: string;
  recipient: string;
  style: string;
  budget: string;
  message: string;
  specialInstructions: string;
}) {
  const session = await auth();

  try {
    const requestId = generateRequestId();

    const req = await prisma.customGiftRequest.create({
      data: {
        requestId,
        userId: session?.user?.id || null,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        occasion: data.occasion || null,
        recipient: data.recipient || null,
        style: data.style || null,
        budget: data.budget || null,
        message: data.message || null,
        specialInstructions: data.specialInstructions || null,
        status: "NEW",
      },
    });

    revalidatePath("/admin/custom-gifts");
    return { success: true, requestId: req.requestId };
  } catch (err: any) {
    console.error("Custom gift submit error:", err);
    return { success: false, error: err.message || "Something went wrong" };
  }
}

export async function getCustomGiftRequests() {
  return prisma.customGiftRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });
}

export async function getCustomGiftRequest(id: string) {
  return prisma.customGiftRequest.findUnique({
    where: { id },
    include: { user: { select: { name: true, email: true, phone: true } } },
  });
}

export async function updateCustomGiftStatus(id: string, status: string, adminNotes?: string) {
  try {
    await prisma.customGiftRequest.update({
      where: { id },
      data: { status, ...(adminNotes !== undefined ? { adminNotes } : {}) },
    });
    revalidatePath("/admin/custom-gifts");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getMyCustomGiftRequests() {
  const session = await auth();
  if (!session?.user) return [];

  return prisma.customGiftRequest.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}
