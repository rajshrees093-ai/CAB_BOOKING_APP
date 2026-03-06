import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Get user from database
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get latest ride
  const { data: ride, error: rideError } = await supabase
    .from("rides")
    .select("*")
    .eq("rider_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (rideError) {
    return NextResponse.json({});
  }

  return NextResponse.json(ride || {});
}