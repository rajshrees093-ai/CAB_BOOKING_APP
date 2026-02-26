"use client";

import { useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  useEffect(() => {
    const syncUser = async () => {
      try {
        await fetch("/api/users/sync", {
          method: "POST",
        });
      } catch (err) {
        console.error("Sync failed:", err);
      }
    };

    syncUser();
  }, []);

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