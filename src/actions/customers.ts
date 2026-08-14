"use server";

import { prisma } from "@/lib/prisma";

export async function getCustomers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { orders: true, enquiries: true }
      }
    }
  });
}
