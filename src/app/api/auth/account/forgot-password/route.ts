import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
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
      {
        message:
          "Oops! Missing or invalid parameters. Please check the link and try again.",
      },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email, passwordToken: token },
    });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "Invalid or expired verification token. Please request a new password reset.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message:
        "Email verified successfully. You can now proceed to reset your password.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong on our end. Please try again later.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown";
  if (!rateLimiter(ip)) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const { email, password } = await req.json();

  if (!password) {
    return NextResponse.json(
      { message: "Please provide a new password to continue." },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (!existingUser) {
    return NextResponse.json(
      {
        message:
          "We couldn't find an account with that email address. Please check and try again.",
      },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword, passwordToken: null },
  });

  const response = NextResponse.json({
    message:
      "Your password has been reset successfully! You will be redirected to the login page shortly. We're excited to have you back!",
    redirect: "/login",
    status: 200,
  });

  return response;
}
