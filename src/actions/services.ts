"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getServices() {
  return prisma.service.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createService(data: any) {
  try {
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    await prisma.service.create({
      data: {
        title: data.title,
        slug: slug,
        description: data.description || "",
        image: data.image || "",
        isPublished: data.isPublished !== undefined ? data.isPublished : true,
      }
    });
    revalidatePath("/admin/services");
    revalidatePath("/services");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateService(id: string, data: any) {
  try {
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    await prisma.service.update({
      where: { id },
      data: {
        title: data.title,
        slug: slug,
        description: data.description || "",
        image: data.image || "",
        isPublished: data.isPublished,
      }
    });
    revalidatePath("/admin/services");
    revalidatePath("/services");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteService(id: string) {
  try {
    await prisma.service.delete({ where: { id } });
    revalidatePath("/admin/services");
    revalidatePath("/services");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
