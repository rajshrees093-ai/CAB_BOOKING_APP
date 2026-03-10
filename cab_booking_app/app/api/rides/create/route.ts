import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();

    // existing fields
    const { pickup, drop, ride_type } = body;

    // generate ride id for receipt & history
    const rideId = randomUUID();

    // get uuid from users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, name")
      .eq("clerk_id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    // ride metadata (for history + receipt)
    const rideData = {
      id: rideId,
      rider_id: user.id,
      pickup_location: pickup,
      drop_location: drop,
      ride_type: ride_type,
      fare: 200,
      status: "requested",

      // added for ride history
      ride_status: "requested",
      payment_status: "pending",

      // timestamps
      created_at: new Date().toISOString(),

      // receipt support
      receipt_id: `REC-${Date.now()}`
    };

    // insert ride
    const { data, error } = await supabase
      .from("rides")
      .insert(rideData)
      .select();

    if (error) {
      console.log(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    /*
    Prepare receipt object (will be used later
    when ride completes and payment is done)
    */

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
      message: "Ride created",
      data,
      receipt_preview: receipt
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );

  }
}