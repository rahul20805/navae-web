import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, author, text, rating } = body;

    if (!author || !text || !rating) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        author,
        text,
        rating: Number(rating),
        isApproved: false, // Must be approved by owner
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
