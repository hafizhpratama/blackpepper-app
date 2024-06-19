"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Form from "./form";
import AuthLayout from "@/components/auth-layout";
import TermsPrivacy from "@/components/terms-privacy";

const ForgotPasswordPage = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      redirect("/dashboard");
    }
  }, [session]);

  return (
    <AuthLayout>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Forgot Password</h1>
      </div>
      <Form />
      <TermsPrivacy />
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
