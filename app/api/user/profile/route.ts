import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, email } = await req.json();

    // Check if email is taken by another user
    if (email !== session.user.email) {
      const existingUser = await db.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email already taken" },
          { status: 400 }
        );
      }
    }

    // Update user profile
    const user = await db.user.update({
      where: { id: session.user.id },
      data: { name, email }
    });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" }, 
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        family: {
          include: {
            members: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                accountType: true,
                familyRole: true
              }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: "User not found" }, 
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      { message: "Failed to fetch profile" }, 
      { status: 500 }
    )
  }
}