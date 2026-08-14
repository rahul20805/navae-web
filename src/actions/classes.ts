"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getClasses() {
  return prisma.class.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createClass(data: any) {
  try {
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    await prisma.class.create({
      data: {
        title: data.title,
        slug: slug,
        description: data.description || "",
        image: data.image || "",
        price: data.price ? parseFloat(data.price) : null,
        instructor: data.instructor || "",
        schedule: data.schedule || "",
        duration: data.duration || "",
        maxStudents: data.maxStudents ? parseInt(data.maxStudents) : null,
        isPublished: data.isPublished !== undefined ? data.isPublished : true,
      }
    });
    revalidatePath("/admin/classes");
    revalidatePath("/classes");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateClass(id: string, data: any) {
  try {
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    await prisma.class.update({
      where: { id },
      data: {
        title: data.title,
        slug: slug,
        description: data.description || "",
        image: data.image || "",
        price: data.price ? parseFloat(data.price) : null,
        instructor: data.instructor || "",
        schedule: data.schedule || "",
        duration: data.duration || "",
        maxStudents: data.maxStudents ? parseInt(data.maxStudents) : null,
        isPublished: data.isPublished,
      }
    });
    revalidatePath("/admin/classes");
    revalidatePath("/classes");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteClass(id: string) {
  try {
    await prisma.class.delete({ where: { id } });
    revalidatePath("/admin/classes");
    revalidatePath("/classes");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
