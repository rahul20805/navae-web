"use server";

import { checkOwner } from "@/lib/check-owner";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getGallery() {
  return prisma.gallery.findMany({ orderBy: { createdAt: "desc" } });
}

export async function addGalleryItem(data: { url: string, title?: string }) {
  try {
    await prisma.gallery.create({
      data: {
        url: data.url,
        title: data.title || "",
      }
    });
    revalidatePath("/admin/gallery");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteGalleryItem(id: string) {
  await checkOwner();

  try {
    await prisma.gallery.delete({ where: { id } });
    revalidatePath("/admin/gallery");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
