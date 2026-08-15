"use server";

import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function getCustomers(search?: string, roleFilter?: string) {
  const whereClause: any = {};
  
  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  if (roleFilter && roleFilter !== "ALL") {
    whereClause.role = roleFilter;
  }

  const users = await prisma.user.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { orders: true, enquiries: true, bookings: true }
      },
      orders: {
        where: { status: { notIn: ["CANCELLED", "REFUNDED"] } },
        select: { totalAmount: true }
      }
    }
  });

  return users.map(user => {
    const totalSpent = user.orders.reduce((sum, order) => sum + order.totalAmount, 0);
    return {
      ...user,
      totalSpent
    };
  });
}

export async function getCustomerProfile(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: { include: { product: true } } }
      },
      bookings: {
        orderBy: { date: "desc" },
        include: { class: true }
      },
      enquiries: {
        orderBy: { createdAt: "desc" }
      },
      emails: {
        orderBy: { sentAt: "desc" }
      },
      customGiftRequests: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!user) return null;

  const validOrders = user.orders.filter(o => !["CANCELLED", "REFUNDED"].includes(o.status));
  const totalSpent = validOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  
  const productFrequency: Record<string, { count: number, name: string }> = {};
  validOrders.forEach(order => {
    order.items.forEach(item => {
      if (!productFrequency[item.productId]) {
        productFrequency[item.productId] = { count: 0, name: item.product.name };
      }
      productFrequency[item.productId].count += item.quantity;
    });
  });

  const frequentProducts = Object.values(productFrequency)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    ...user,
    totalSpent,
    lastOrderDate: validOrders.length > 0 ? validOrders[0].createdAt : null,
    frequentProducts
  };
}

export async function sendCustomerEmail(userId: string, email: string, subject: string, content: string) {
  try {
    let status = "SENT";
    
    // Check if SMTP is configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"ANANTA Art & Craft" <${process.env.SMTP_USER}>`,
        to: email,
        subject,
        html: content,
      });
    } else {
      console.warn("SMTP credentials not configured. Mocking email delivery in database.");
      status = "MOCKED";
    }

    await prisma.emailLog.create({
      data: {
        userId,
        subject,
        content,
        status
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    await prisma.emailLog.create({
      data: {
        userId,
        subject,
        content,
        status: "FAILED"
      }
    });
    return { success: false, error: "Failed to send email." };
  }
}
