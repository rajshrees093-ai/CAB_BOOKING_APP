import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { rideId } = await req.json();

    // find driver uuid
    const { data: driver, error: driverError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (driverError || !driver) {
      return NextResponse.json(
        { error: "Driver not found" },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from("rides")
      .update({
        driver_id: driver.id,
        status: "accepted"
      })
      .eq("id", rideId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Ride accepted 🚕" });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );

  }

}