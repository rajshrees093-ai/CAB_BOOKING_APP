import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

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

    const { pickup, drop, ride_type } = body;

    if (!pickup || !drop) {
      return NextResponse.json(
        { error: "Pickup and drop locations required" },
        { status: 400 }
      );
    }

    // generate ride id
    const rideId = randomUUID();

    // get supabase user
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, name")
      .eq("clerk_id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      );
    }

    // ride data
    const rideData = {
      id: rideId,
      rider_id: user.id,
      pickup_location: pickup,
      drop_location: drop,
      ride_type: ride_type,
      fare: 200,

      // IMPORTANT: drivers look for this field
      status: "requested",

      // extra metadata
      ride_status: "requested",
      payment_status: "pending",

      created_at: new Date().toISOString(),

      receipt_id: `REC-${Date.now()}`
    };

    // insert ride
    const { data: ride, error } = await supabase
      .from("rides")
      .insert([rideData])
      .select()
      .single();

    if (error) {
      console.log("Insert error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // receipt preview
    const receipt = {
      receipt_id: rideData.receipt_id,
      ride_id: rideId,
      rider_id: user.id,
      rider_name: user.name,
      rider_email: user.email,
      pickup_location: pickup,
      drop_location: drop,
      ride_type: ride_type,
      fare: rideData.fare,
      payment_status: rideData.payment_status,
      created_at: rideData.created_at
    };

    return NextResponse.json({
      message: "Ride created successfully",
      ride,
      receipt_preview: receipt
    });

  } catch (error) {

    console.log("Server error:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}