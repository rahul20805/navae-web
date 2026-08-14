"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createProduct(data: any) {
  try {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    await prisma.product.create({
      data: {
        name: data.name,
        slug: slug,
        description: data.description || "",
        price: parseFloat(data.price),
        discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : null,
        stock: parseInt(data.stock),
        images: data.images || [],
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
        isPublished: data.isPublished !== undefined ? data.isPublished : true,
        customization: data.customization !== undefined ? data.customization : false,
        categoryId: data.categoryId || null,
        variants: data.variants ? JSON.parse(data.variants) : null,
      }
    });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: slug,
        description: data.description || "",
        price: parseFloat(data.price),
        discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : null,
        stock: parseInt(data.stock),
        images: data.images || [],
        isAvailable: data.isAvailable,
        isPublished: data.isPublished,
        customization: data.customization,
        categoryId: data.categoryId || null,
        variants: data.variants ? JSON.parse(data.variants) : null,
      }
    });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
