"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getGallery() {
  return prisma.gallery.findMany({ orderBy: { createdAt: "desc" } });
}

export async function addGalleryItem(data: { imageUrl: string, caption?: string }) {
  try {
    await prisma.gallery.create({
      data: {
        imageUrl: data.imageUrl,
        caption: data.caption || "",
      }
    });
    revalidatePath("/admin/gallery");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    await prisma.gallery.delete({ where: { id } });
    revalidatePath("/admin/gallery");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
