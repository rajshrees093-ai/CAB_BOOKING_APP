import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", userId)
      .single();

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" });
    }

    // Insert new user
    const { data, error } = await supabase.from("users").insert([
      {
        clerk_id: userId,
        role: "rider",
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ message: "User synced", data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}