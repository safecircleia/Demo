import { NextResponse } from "next/server";
import { hash, compare } from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.emailVerified) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true }
    });

    if (!user?.password) {
      return new NextResponse("Invalid user", { status: 400 });
    }

    const isValid = await compare(currentPassword, user.password);
    if (!isValid) {
      return new NextResponse("Invalid password", { status: 400 });
    }

    const hashedPassword = await hash(newPassword, 12);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CHANGE_PASSWORD_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}