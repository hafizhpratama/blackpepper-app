import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { rateLimiter } from "@/lib/rate-limiter";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown";
  if (!rateLimiter(ip)) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  if (!email || !token) {
    return NextResponse.json(
      { message: "Missing or invalid item" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email, emailToken: token },
    });

    if (user?.emailVerified) {
      return NextResponse.json(
        { message: "Account is verified." },
        { status: 400 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { message: "Invalid verification token" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date().toISOString() },
    });

    return NextResponse.json({ message: "Email verified successfully." });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
