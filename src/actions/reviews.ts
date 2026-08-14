"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getReviews() {
  return prisma.review.findMany({ 
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      product: true
    }
  });
}

export async function toggleReviewVisibility(id: string, isPublished: boolean) {
  try {
    await prisma.review.update({
      where: { id },
      data: { isPublished }
    });
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteReview(id: string) {
  try {
    await prisma.review.delete({ where: { id } });
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
