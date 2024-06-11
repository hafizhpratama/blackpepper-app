"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const LogoutButton: React.FC = () => {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
      Sign Out
    </DropdownMenuItem>
  );
};

export default LogoutButton;
