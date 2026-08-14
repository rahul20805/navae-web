"use server";

import Razorpay from "razorpay";
import { randomUUID } from "crypto";

export async function createRazorpayOrder(amount: number) {
  try {
    // Check if keys are configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.warn("Razorpay keys not configured. Returning dummy order for testing.");
      return { 
        success: true, 
        orderId: `dummy_order_${randomUUID().slice(0, 10)}`, 
        amount: Math.round(amount * 100),
        currency: "INR" 
      };
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(amount * 100), // Razorpay requires amount in smallest currency unit (paise)
      currency: "INR",
      receipt: randomUUID(),
    };

    const order = await razorpay.orders.create(options);
    
    return { success: true, orderId: order.id, amount: order.amount, currency: order.currency };
  } catch (error: any) {
    console.error("Razorpay error:", error);
    return { success: false, error: error.message || "Failed to create payment order" };
  }
}
