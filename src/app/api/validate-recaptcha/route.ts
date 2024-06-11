import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import axios from "axios";
import { rateLimiter } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown";
  if (!rateLimiter(ip)) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const { token } = await req.json();

  const secretKey = process.env.RECAPTCHA_SERVER_ID;

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );

    const data = response.data;

    if (data.success) {
      return NextResponse.json(
        {
          message: "Success recaptha.",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Failed recaptha.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "Recaptcha verification failed.",
      },
      { status: 500 }
    );
  }
}
