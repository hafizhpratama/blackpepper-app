import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { rateLimiter } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown";
  if (!rateLimiter(ip)) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const { firstName, lastName, email, password } = await req.json();

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json(
      { message: "Please ensure all fields are filled out." },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json(
      {
        message:
          "An account with this email already exists. Please log in or use a different email.",
      },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const token = generateEmailVerificationToken();

  await prisma.user.create({
    data: {
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      emailToken: token,
    },
  });

  await sendVerificationEmail(email, token);

  const response = NextResponse.json({
    message:
      "Your account has been created successfully! Please check your email to verify your account. You will be redirected to the login page shortly.",
    redirect: "/login",
    status: 200,
  });

  return response;
}

const sendVerificationEmail = async (email: string, token: string) => {
  const transporter: nodemailer.Transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT) || 0,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  const emailData = {
    from: `${process.env.EMAIL_FROM}`,
    to: email,
    subject: "Email Verification",
    html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html dir="ltr" lang="en">
      
      <head>
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <meta name="x-apple-disable-message-reformatting" />
      </head>
      
      <body style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif">
        <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Log in with this magic link.</div>
        <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:37.5em;margin:0 auto;padding:20px 25px 48px;background-image:url('/assets/raycast-bg.png');background-position:bottom;background-repeat:no-repeat, no-repeat">
          <tbody>
            <tr style="width:100%">
              <td><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package2 h-6 w-6"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path><path d="M12 3v6"></path></svg>
                <h1 style="font-size:28px;font-weight:bold;margin-top:48px">🪄 Your magic link</h1>
                <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:24px 0">
                  <tbody>
                    <tr>
                      <td>
                        <p style="font-size:16px;line-height:26px;margin:16px 0"><a href="${process.env.NEXTAUTH_URL}/account/verify?email=${email}&token=${token}" style="color:#000000;text-decoration:none;font-weight: bold;" target="_blank">👉 Click here to sign in 👈</a></p>
                        <p style="font-size:16px;line-height:26px;margin:16px 0">If you didn&#x27;t request this, please ignore this email.</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p style="font-size:16px;line-height:26px;margin:16px 0">Best,<br />- ${process.env.EMAIL_BY}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
      
      </html>    
      `,
  };

  try {
    await transporter.sendMail(emailData);
  } catch (error) {
    throw new Error(
      "There was an error sending the verification email. Please try again later."
    );
  }
};

const generateEmailVerificationToken = () => {
  return randomBytes(32).toString("hex");
};
