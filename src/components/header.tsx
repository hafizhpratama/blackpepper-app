import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Package2Icon } from "lucide-react";
import Navigation from "./navigation";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 flex items-center justify-between h-16 border-b bg-background px-4 md:px-6 z-10">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Package2Icon className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
      </div>

      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Navigation />
      </nav>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <nav className="grid gap-4 text-lg font-medium">
            <Navigation isMobile />
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default Header;
