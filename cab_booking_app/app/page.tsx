"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, []);

  return (
    <main className="flex items-center justify-center h-screen">

      <SignedOut>
        <SignInButton />
      </SignedOut>

      <SignedIn>
        Redirecting...
      </SignedIn>

    </main>
  );
}