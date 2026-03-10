import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

  try {

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // get user's supabase uuid
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      );
    }

    // fetch ride history
    const { data, error } = await supabase
      .from("rides")
      .select("*")
      .eq("rider_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Ride history fetched successfully",
      rides: data
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );

  }

}