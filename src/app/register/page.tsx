"use client";

import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Form from "./form";
import LoginButton from "@/components/login-button";
import TermsPrivacy from "@/components/terms-privacy";
import AuthLayout from "@/components/auth-layout";

const Page = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      redirect("/dashboard");
    }
  }, [session]);

  return (
    <AuthLayout>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Sign Up</h1>
      </div>
      <Form />
      <div className="grid gap-4">
        <LoginButton />
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </div>
      <TermsPrivacy />
    </AuthLayout>
  );
};

export default Page;
