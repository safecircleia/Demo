import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { accountType, familyCode } = await req.json();

    // Find user by email first
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // For child accounts, verify family code
    if (accountType === "child" && familyCode) {
      const parentUser = await prisma.user.findFirst({
        where: {
          familyCode,
          accountType: "parent"
        }
      });

      if (!parentUser) {
        return NextResponse.json(
          { error: "Invalid family code" },
          { status: 400 }
        );
      }
    }

    // Generate unique family code for parents
    const newFamilyCode = accountType === "parent" 
      ? Math.random().toString(36).substring(2, 8).toUpperCase()
      : familyCode;

    const updatedUser = await prisma.$transaction(async (tx) => {
      // Update or create onboarding status
      await tx.onboardingStatus.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          completed: true,
          step: 2
        },
        update: {
          completed: true,
          step: 2
        }
      });

      // Update user
      return tx.user.update({
        where: { id: user.id },
        data: {
          accountType,
          familyCode: newFamilyCode,
          familyId: accountType === "child" ? 
            (await tx.user.findFirst({ 
              where: { familyCode } 
            }))?.id : null
        }
      });
    });

    return NextResponse.json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}