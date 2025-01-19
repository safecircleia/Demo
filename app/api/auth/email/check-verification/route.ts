import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ isVerified: false }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { emailVerified: true }
    });

    return NextResponse.json({ isVerified: !!user?.emailVerified });
  } catch (error) {
    return NextResponse.json({ isVerified: false }, { status: 500 });
  }
}