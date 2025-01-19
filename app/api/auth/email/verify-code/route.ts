import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const { code, email } = await req.json();
    let emailToVerify: string;

    // Determine which email to verify
    if (session?.user?.email) {
      emailToVerify = session.user.email;
    } else if (email) {
      emailToVerify = email;
    } else {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Verify the code
    const verification = await db.verificationToken.findFirst({
      where: {
        email: emailToVerify,
        token: code,
        expires: { gt: new Date() }
      }
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 400 }
      );
    }

    // If user is already registered (profile verification)
    if (session?.user?.email) {
      // Update user's email verification status
      await db.user.update({
        where: { email: emailToVerify },
        data: { emailVerified: true }  // Changed from Date to Boolean
      });
    }

    // Delete the used verification token
    await db.verificationToken.delete({
      where: { token: verification.token } // Use token instead of id since it's @unique
    });

    return NextResponse.json({ 
      success: true,
      verified: true 
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}