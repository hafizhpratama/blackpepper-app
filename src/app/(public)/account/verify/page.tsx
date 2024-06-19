import { Suspense } from "react";
import VerifyEmail from "./verify-email";

export default function Page() {
  return (
    <>
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
          <Suspense>
            <div className="mx-auto grid w-full max-w-6xl gap-2">
              <h1 className="text-3xl font-semibold">Email Verification</h1>
            </div>
            <div className="mx-auto grid w-full max-w-6xl items-start gap-6 ">
              <VerifyEmail />
            </div>
          </Suspense>
        </main>
      </div>
    </>
  );
}
