import React from "react";
import Link from "next/link";
import { Package2 } from "lucide-react";

interface NavigationProps {
  isMobile?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isMobile = false }) => {
  return (
    <>
      <Link
        href="#"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        <Package2 className="h-6 w-6" />
        <span className="sr-only">Acme Inc</span>
      </Link>
      <Link
        href="/dashboard"
        className={`text-muted-foreground transition-colors hover:text-foreground ${
          isMobile ? "md:hidden" : ""
        }`}
      >
        Dashboard
      </Link>
    </>
  );
};

export default Navigation;
