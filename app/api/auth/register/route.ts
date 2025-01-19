import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { generateFamilyCode } from "@/lib/utils";

export type RegisterError = {
  email?: string[];
  password?: string[];
  name?: string[];
  familyCode?: string[];
  general?: string[];
};

export async function POST(req: Request) {
  try {
    const { email, password, name, accountType, verificationCode } = await req.json();
    const errors: RegisterError = {};

    // Verify the code first
    const verification = await db.verificationToken.findFirst({
      where: {
        email,
        token: verificationCode,
        expires: { gt: new Date() }
      }
    });

    if (!verification) {
      return NextResponse.json(
        { errors: { general: ["Invalid or expired verification code"] } },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!email) {
      errors.email = ["Email is required"];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = ["Invalid email format"];
    }

    if (!password) {
      errors.password = ["Password is required"];
    } else if (password.length < 8) {
      errors.password = ["Password must be at least 8 characters"];
    }

    if (!name) {
      errors.name = ["Name is required"];
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { errors },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          errors: {
            email: ["An account with this email already exists"]
          }
        },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 12);
    const familyCode = accountType === 'parent' ? generateFamilyCode() : null;

    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        accountType,
        familyCode,
        emailVerified: true, // Changed from DateTime to Boolean
        onboarding: {
          create: {
            completed: false,
            step: 1
          }
        }
      }
    });

    // Delete the verification token after successful registration
    await db.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: verification.identifier,
          token: verification.token
        }
      }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        accountType: user.accountType,
        familyCode: user.familyCode
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { 
        errors: {
          general: ["An unexpected error occurred. Please try again later."]
        }
      },
      { status: 500 }
    );
  }
}