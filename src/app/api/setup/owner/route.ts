import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { setupSecret } = body;

    // Verify the secret
    if (!process.env.SETUP_SECRET || setupSecret !== process.env.SETUP_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = process.env.OWNER_EMAIL;
    const password = process.env.OWNER_PASSWORD;

    if (!email || !password) {
      return NextResponse.json({ error: "OWNER_EMAIL or OWNER_PASSWORD not configured" }, { status: 500 });
    }

    // Check if an owner already exists
    const existingOwner = await prisma.user.findFirst({
      where: { role: "OWNER" }
    });

    if (existingOwner) {
      return NextResponse.json({ error: "An owner account already exists." }, { status: 400 });
    }

    // Check if email is taken by a non-owner
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      // If they somehow registered before we blocked it, we upgrade them
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { email },
        data: { role: "OWNER", password: hashedPassword, name: "Owner" }
      });
      return NextResponse.json({ success: true, message: "Existing user upgraded to OWNER." });
    }

    // Create the new owner
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name: "Owner",
        email: email,
        password: hashedPassword,
        role: "OWNER",
      }
    });

    return NextResponse.json({ success: true, message: "Owner account successfully created." });
    
  } catch (error) {
    console.error("Setup owner error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
