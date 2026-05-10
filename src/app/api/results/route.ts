import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { score, profile } = await req.json();

    if (score === undefined || !profile) {
      return NextResponse.json(
        { error: "Eksik parametre" },
        { status: 400 }
      );
    }

    const result = await prisma.testResult.create({
      data: {
        score,
        profile,
      },
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("TestResult save error:", error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
