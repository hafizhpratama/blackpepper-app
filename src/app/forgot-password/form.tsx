import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Spinner from "@/components/spinner";
import { sendForgotPasswordEmail } from "@/lib/actions";
import { forgotPasswordSchema } from "@/schemas/user";

type ForgotPasswordInputs = z.infer<typeof forgotPasswordSchema>;

const Form = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInputs) => {
    setLoading(true);
    try {
      const result = await sendForgotPasswordEmail({ email: data.email });
      setMessage(result.message);
      setTimeout(() => {
        router.push(result.redirect as string);
      }, 5000);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {message && (
        <Alert className="text-green-600 border-green-600 mb-4">
          <AlertTitle>Magic Link Send Successful!</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="your-email@example.com"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Spinner /> : "Submit"}
        </Button>
      </form>
    </>
  );
};

export default Form;
