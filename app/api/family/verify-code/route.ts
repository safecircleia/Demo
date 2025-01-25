import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: "Family code is required" },
        { status: 400 }
      );
    }

    const parentUser = await prisma.user.findFirst({
      where: {
        familyCode: code,
        accountType: "parent"
      }
    });

    if (!parentUser) {
      return NextResponse.json(
        { error: "Invalid family code" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true
    });

  } catch (error) {
    console.error("Family code verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify family code" },
      { status: 500 }
    );
  }
}