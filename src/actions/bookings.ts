"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getClasses() {
  try {
    return await prisma.class.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch classes:", error);
    return [];
  }
}

export async function getClassBySlug(slug: string) {
  try {
    return await prisma.class.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error("Failed to fetch class:", error);
    return null;
  }
}

export async function createBooking(data: { classId: string, date: Date, notes?: string }) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error("You must be logged in to book a class");
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        classId: data.classId,
        date: data.date,
        notes: data.notes,
        status: "PENDING",
      },
    });

    return { success: true, bookingId: booking.id };
  } catch (error: any) {
    console.error("Failed to create booking:", error);
    return { success: false, error: error.message || "Something went wrong" };
  }
}
