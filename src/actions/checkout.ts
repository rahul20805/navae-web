"use server";

import { prisma } from "@/lib/prisma";

export async function validateCoupon(code: string, cartTotal: number) {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return { valid: false, error: "Invalid coupon code." };
    }

    if (!coupon.isActive) {
      return { valid: false, error: "This coupon is currently inactive." };
    }

    const now = new Date();
    if (coupon.validFrom && now < new Date(coupon.validFrom)) {
      return { valid: false, error: "This coupon is not yet valid." };
    }

    if (coupon.validUntil && now > new Date(coupon.validUntil)) {
      return { valid: false, error: "This coupon has expired." };
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, error: "This coupon has reached its usage limit." };
    }

    if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
      return { valid: false, error: `Minimum order value of ₹${coupon.minOrderValue} required.` };
    }

    let discountAmount = 0;
    if (coupon.discountType === "FIXED") {
      discountAmount = coupon.discountValue;
    } else if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
    }

    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }

    // Ensure discount doesn't exceed cart total
    discountAmount = Math.min(discountAmount, cartTotal);

    return {
      valid: true,
      coupon,
      discountAmount,
      finalTotal: cartTotal - discountAmount,
    };
  } catch (error) {
    console.error("Coupon validation error:", error);
    return { valid: false, error: "Error validating coupon." };
  }
}
