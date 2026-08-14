"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createCategory(data: any) {
  try {
    // Generate slug from name
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    await prisma.category.create({
      data: {
        name: data.name,
        slug: slug,
        description: data.description || "",
        image: data.image || "",
      }
    });
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateCategory(id: string, data: any) {
  try {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: slug,
        description: data.description || "",
        image: data.image || "",
      }
    });
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
