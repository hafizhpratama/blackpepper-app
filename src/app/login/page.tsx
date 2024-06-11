"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Form from "./form";
import Link from "next/link";
import AuthLayout from "@/components/auth-layout";
import LoginButton from "@/components/login-button";
import TermsPrivacy from "@/components/terms-privacy";

const Page: React.FC = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      redirect("/dashboard");
    }
  }, [session]);

  return (
    <AuthLayout>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
      </div>
      <Form />
      <div className="grid gap-4">
        <LoginButton />
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline">
            Sign up
          </Link>
        </div>
      </div>
      <TermsPrivacy />
    </AuthLayout>
  );
};

export default Page;
