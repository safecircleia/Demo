// app/api/family/route.ts
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { generateFamilyCode } from "@/lib/utils"
import { z } from "zod"

const createFamilySchema = z.object({
  name: z.string().min(1),
  settings: z.object({
    security: z.object({
      autoBlock: z.boolean(),
      parentApproval: z.boolean()
    })
  })
})

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createFamilySchema.parse(body);
    const familyCode = await generateFamilyCode();

    const family = await prisma.family.create({
      data: {
        name: validatedData.name,
        code: familyCode,
        settings: validatedData.settings,
        members: {
          connect: { email: session.user.email }
        }
      }
    });

    await prisma.user.update({
      where: { email: session.user.email },
      data: { 
        familyRole: "ADMIN"
      }
    });

    return NextResponse.json({ 
      success: true,
      family 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get code from URL params
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: "Family code is required" },
        { status: 400 }
      );
    }

    // Find parent user with this family code
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