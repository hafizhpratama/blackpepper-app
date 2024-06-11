import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";

interface NavigationProps {
  isMobile?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isMobile = false }) => {
  return (
    <>
      <Link
        href="/login"
        className={`text-muted-foreground transition-colors hover:text-foreground ${
          isMobile ? "md:hidden mt-4" : ""
        }`}
      >
        <Button className="flex-1 w-full">Login</Button>
      </Link>
      <Link
        href="/terms"
        className={`text-muted-foreground transition-colors hover:text-foreground ${
          isMobile ? "md:hidden" : ""
        }`}
      >
        Terms
      </Link>
      <Link
        href="/privacy"
        className={`text-muted-foreground transition-colors hover:text-foreground ${
          isMobile ? "md:hidden" : ""
        }`}
      >
        Privacy
      </Link>
    </>
  );
};

export default Navigation;
