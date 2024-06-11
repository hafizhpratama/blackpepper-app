import { Suspense } from "react";
import VerifyEmail from "./verify-email";

export default function Page() {
  return (
    <Suspense>
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Email Verification</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 ">
        <VerifyEmail />
      </div>
    </Suspense>
  );
}
