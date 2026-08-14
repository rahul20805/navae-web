"use server";

import { checkOwner } from "@/lib/check-owner";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCoupons() {
  return prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getCouponById(id: string) {
  return prisma.coupon.findUnique({
    where: { id },
  });
}

export async function createCoupon(data: {
  code: string;
  discountType: string;
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  validFrom?: Date;
  validUntil?: Date;
  usageLimit?: number;
  isActive: boolean;
}) {
  await checkOwner();

  try {
    const existing = await prisma.coupon.findUnique({ where: { code: data.code.toUpperCase() } });
    if (existing) {
      throw new Error(`Coupon with code ${data.code} already exists.`);
    }

    await prisma.coupon.create({
      data: {
        ...data,
        code: data.code.toUpperCase(),
      },
    });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateCoupon(id: string, data: any) {
  await checkOwner();

  try {
    await prisma.coupon.update({
      where: { id },
      data: {
        ...data,
        code: data.code.toUpperCase(),
      },
    });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function toggleCouponStatus(id: string, isActive: boolean) {
  try {
    await prisma.coupon.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteCoupon(id: string) {
  await checkOwner();

  try {
    await prisma.coupon.delete({ where: { id } });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
