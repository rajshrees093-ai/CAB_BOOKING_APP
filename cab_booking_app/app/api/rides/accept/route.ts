import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { rideId } = body;

    if (!rideId) {
      return NextResponse.json(
        { error: "Ride ID required" },
        { status: 400 }
      );
    }

    // get driver uuid
    const { data: driver, error: driverError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (driverError || !driver) {
      return NextResponse.json(
        { error: "Driver not found" },
        { status: 400 }
      );
    }

    // update ride
    const { data, error } = await supabase
      .from("rides")
      .update({
        driver_id: driver.id,
        status: "accepted"
      })
      .eq("id", rideId)
      .select();

    if (error) {
      console.log(error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Ride accepted",
      data
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );

  }

}