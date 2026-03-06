import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { pickup, drop } = body;

    // get uuid from users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("rides")
      .insert([
        {
          rider_id: user.id,
          pickup_location: pickup,
          drop_location: drop,
          status: "requested",
          fare: 0
        }
      ]);

    if (error) {
      console.log(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Ride created", data });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}