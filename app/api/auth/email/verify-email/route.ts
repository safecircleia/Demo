import { NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { auth } from "@/auth";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const session = await auth();
    let emailToVerify: string;

    // Handle both authenticated and registration cases
    if (session?.user?.email) {
      emailToVerify = session.user.email;
    } else {
      // For registration, get email from request body
      const { email } = await req.json();
      if (!email) {
        return NextResponse.json(
          { error: "Email is required" },
          { status: 400 }
        );
      }
      emailToVerify = email;
    }

    const token = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing tokens for this email
    await db.verificationToken.deleteMany({
      where: { email: emailToVerify }
    });

    // Create a new token
    await db.verificationToken.create({
      data: {
        identifier: emailToVerify, // Add this line - using email as identifier
        email: emailToVerify,
        token: token,
        expires: new Date(Date.now() + 3600000) // 1 hour expiry
      }
    });

    await resend.emails.send({
      from: "no-reply@safecircle.tomasps.com",
      to: emailToVerify,
      subject: "Verify your email address",
      html: `Your verification code is: ${token}`
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
