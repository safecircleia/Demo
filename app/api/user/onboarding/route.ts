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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Prevent repeated onboarding
    if (user.onboardingComplete) {
      return NextResponse.json(
        { error: "Onboarding already completed" },
        { status: 400 }
      );
    }

    const { accountType, familyCode, familyOption, familyName, familySettings } = await req.json();

    const updatedUser = await prisma.$transaction(async (tx) => {
      // Create family if parent is creating one
      if (accountType === "parent" && familyOption === "create") {
        const family = await tx.family.create({
          data: {
            name: familyName,
            code: Math.random().toString(36).substring(2, 8).toUpperCase(),
            settings: familySettings || {},
            members: {
              connect: { id: user.id }
            }
          }
        });

        return tx.user.update({
          where: { id: user.id },
          data: {
            accountType,
            familyRole: "ADMIN",
            familyId: family.id,
            onboardingComplete: true
          }
        });
      }

      // Join existing family for children or parents joining
      if (familyCode) {
        const existingFamily = await tx.user.findFirst({
          where: { familyCode },
          select: { family: true }
        });

        if (!existingFamily?.family) {
          throw new Error("Invalid family code");
        }

        return tx.user.update({
          where: { id: user.id },
          data: {
            accountType,
            familyId: existingFamily.family.id,
            onboardingComplete: true
          }
        });
      }

      throw new Error("Invalid onboarding configuration");
    });

    return NextResponse.json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}