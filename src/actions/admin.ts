"use server";

import { checkOwner } from "@/lib/check-owner";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// ---- PRODUCTS ----

export async function createProduct(data: { name: string, description: string, price: number, stock: number, imageUrl: string }) {
  await checkOwner();
  
  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  await prisma.product.create({
    data: {
      name: data.name,
      slug: slug,
      description: data.description,
      price: data.price,
      stock: data.stock,
      images: [data.imageUrl],
      isAvailable: true,
    }
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function deleteProduct(id: string) {
  await checkOwner();

  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

// ---- CLASSES ----

export async function createClass(data: { title: string, instructor: string, schedule: string, duration: string, price: number, maxStudents: number, imageUrl: string }) {
  await checkOwner();

  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  await prisma.class.create({
    data: {
      title: data.title,
      slug: slug,
      instructor: data.instructor,
      schedule: data.schedule,
      duration: data.duration,
      price: data.price,
      maxStudents: data.maxStudents,
      image: data.imageUrl,
      isActive: true,
    }
  });

  revalidatePath("/admin/classes");
  revalidatePath("/classes");
}

export async function deleteClass(id: string) {
  await checkOwner();

  await prisma.class.delete({ where: { id } });
  revalidatePath("/admin/classes");
  revalidatePath("/classes");
}
