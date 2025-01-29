import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { aiSettings: true },
  });

  // Calculate remaining tokens
  const settings = user?.aiSettings || {};
  const tokensRemaining = settings.tokenLimit - (settings.tokensUsed || 0);

  return NextResponse.json({
    ...settings,
    tokensRemaining,
    resetAt: settings.tokensResetAt
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const settings = await prisma.aISettings.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      ...data,
    },
    update: data,
  });

  return NextResponse.json(settings);
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { modelVersion } = await req.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    const settings = await prisma.aISettings.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        modelVersion,
      },
      update: {
        modelVersion,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error updating AI model:", error)
    return new NextResponse("Failed to update settings", { status: 500 })
  }
}