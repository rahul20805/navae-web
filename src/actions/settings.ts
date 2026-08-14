"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  const settings = await prisma.setting.findMany();
  // Convert array of {key, value} to an object
  return settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);
}

export async function saveSettings(data: Record<string, string>) {
  try {
    const keys = Object.keys(data);
    
    // Process sequentially or in a transaction
    await prisma.$transaction(
      keys.map((key) => 
        prisma.setting.upsert({
          where: { key },
          update: { value: data[key] },
          create: { key, value: data[key] }
        })
      )
    );

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving settings:", error);
    return { success: false, error: error.message || "Failed to save settings" };
  }
}
