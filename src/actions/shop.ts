"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getProducts() {
  try {
    return await prisma.product.findMany({
      where: { isAvailable: true, isPublished: true },
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

export async function createOrder(data: { 
  items: any[], 
  totalAmount: number, 
  originalAmount?: number,
  discountAmount?: number,
  couponId?: string,
  shippingAddress: string, 
  billingAddress: string 
}) {
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
        originalAmount: data.originalAmount || data.totalAmount,
        discountAmount: data.discountAmount || 0,
        couponId: data.couponId || null,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
        status: "PENDING",
        items: {
          create: data.items.map((item) => ({
            productId: item.id || item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    if (data.couponId) {
      await prisma.coupon.update({
        where: { id: data.couponId },
        data: { usedCount: { increment: 1 } }
      });
    }

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Failed to create order:", error);
    return { success: false, error: error.message || "Something went wrong" };
  }
}

export async function submitEnquiry(data: { name: string, email: string, subject: string, message: string }) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    await prisma.enquiry.create({
      data: {
        name: data.name,
        email: data.email,
        type: data.subject,
        message: data.message,
        userId: userId || null,
        status: "NEW",
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Failed to submit enquiry:", error);
    return { success: false, error: error.message || "Something went wrong" };
  }
}
