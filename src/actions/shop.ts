"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getProducts() {
  try {
    return await prisma.product.findMany({
      where: { isAvailable: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function createOrder(data: { items: any[], totalAmount: number, shippingAddress: string, billingAddress: string }) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!data.items || data.items.length === 0) {
      throw new Error("Cart is empty");
    }

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: data.totalAmount,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
        status: "PENDING",
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Failed to create order:", error);
    return { success: false, error: error.message || "Something went wrong" };
  }
}
