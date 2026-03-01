"use client";

import { useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/users/sync", {
        method: "POST",
      });
    }
  }, [isSignedIn]);

  return (
    <main className="flex items-center justify-center h-screen gap-4">
      <SignedOut>
        <SignInButton />
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </main>
  );
}