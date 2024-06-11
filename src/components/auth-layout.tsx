import React from "react";
import Image from "next/image";
import { LayoutProps } from "@/types/attribute";

const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center lg:grid lg:grid-cols-2">
        <div className="mx-auto grid w-[350px] gap-6">{children}</div>
        <div className="hidden bg-muted lg:block inset-0 bg-zinc-900 flex-grow h-full">
          <Image
            src="/login-image.jpeg"
            alt="Image"
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
