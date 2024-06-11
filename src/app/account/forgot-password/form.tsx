"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Spinner from "@/components/spinner";
import { verifyPasswordToken, resetPassword } from "@/lib/actions";
import { forgotPasswordAccountSchema } from "@/schemas/user";

type ForgotPasswordInputs = z.infer<typeof forgotPasswordAccountSchema>;

const AccountForgotPasswordForm = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(forgotPasswordAccountSchema),
  });

  useEffect(() => {
    const emailVerification = async () => {
      try {
        if (!email || !token) {
          throw new Error("Missing required fields.");
        }
        const result = await verifyPasswordToken({ email, token });
        setMessage(result.message);
      } catch (error: any) {
        setError(
          error.message ||
            "Invalid or expired token. Please request a new password reset."
        );
      }
    };

    emailVerification();
  }, [email, token]);

  const onSubmit = async (data: ForgotPasswordInputs) => {
    setLoading(true);
    setError("");
    try {
      const result = await resetPassword({
        email: email!,
        password: data.password,
      });
      setMessage(result.message);
      setTimeout(() => {
        router.push("/login");
      }, 5000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {message && (
        <Alert className="text-green-600 border-green-600 mb-4">
          <AlertTitle>Reset Password Successful!</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert className="text-red-600 border-red-600 mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            required
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Spinner /> : "Submit"}
        </Button>
      </form>
    </>
  );
};

const Form = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <AccountForgotPasswordForm />
  </Suspense>
);

export default Form;
