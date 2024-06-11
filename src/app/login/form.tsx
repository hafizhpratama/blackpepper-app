import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircleIcon } from "lucide-react";
import Spinner from "@/components/spinner";
import { loginSchema } from "@/schemas/user";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import axios from "axios";
import { recaptcha } from "@/lib/actions";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = loginSchema.safeParse({ email, password });

    if (!validation.success) {
      setErrorMessage(validation.error.errors[0].message);
      return;
    }

    if (process.env.NODE_ENV === "production") {
      if (!executeRecaptcha) {
        setErrorMessage("Recaptcha not yet available.");
        return;
      }

      try {
        setLoading(true);
        const token = await executeRecaptcha("login");

        const response = await recaptcha(token);

        if (response.status !== 200) {
          setErrorMessage("Recaptcha validation failed.");
          setLoading(false);
          return;
        }
      } catch (error) {
        setErrorMessage("An unexpected error occurred. Please try again.");
        setLoading(false);
        return;
      }
    }

    try {
      setLoading(true);
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        setErrorMessage("");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <XCircleIcon className="h-4 w-4" />
          <AlertTitle>Login Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your-email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-sm underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Spinner /> : "Login"}
        </Button>
      </form>
    </>
  );
};

const Form = () => {
  return process.env.NODE_ENV === "production" ? (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.RECAPTCHA_CLIENT_ID as string}
    >
      <LoginForm />
    </GoogleReCaptchaProvider>
  ) : (
    <LoginForm />
  );
};

export default Form;
