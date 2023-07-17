"use client";

import React, { ButtonHTMLAttributes, FC, useState } from "react";
import Button from "./ui/button";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import { Loader2, LogOut } from "lucide-react";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { }

export const SignOutButton: FC<SignOutButtonProps> = (props) => {
  const [isSignOut, setIsSignOut] = useState<boolean>(false);
  return (
    <Button
      {...props}
      variant="ghost"
      onClick={async () => {
        setIsSignOut(true);
        try {
          await signOut();
        } catch (e) {
          toast.error("There was a problem signing out");
        } finally {
          setIsSignOut(false);
        }
      }}
    >
      {isSignOut ? (
        <Loader2 className="animate-spin h-4 w-4" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
    </Button>
  );
};
