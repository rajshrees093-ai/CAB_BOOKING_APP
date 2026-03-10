import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import PDFDocument from "pdfkit";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { rideId: string } }
) {
  try {

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const rideId = params.rideId;

    console.log("Ride ID from URL:", rideId);

    // STEP 1: Get Supabase user id from users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (userError || !user) {
      console.log("User fetch error:", userError);
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      );
    }

    console.log("Supabase user id:", user.id);

    // STEP 2: Fetch ride
    const { data: ride, error: rideError } = await supabase
      .from("rides")
      .select("*")
      .eq("id", rideId)
      .maybeSingle();

    console.log("Ride data:", ride);
    console.log("Ride error:", rideError);

    if (!ride) {
      return NextResponse.json(
        { error: "Ride not found" },
        { status: 404 }
      );
    }

    // STEP 3: Generate PDF
    const doc = new PDFDocument();

    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));

    doc.fontSize(20).text("Cab Booking Receipt", { align: "center" });

    doc.moveDown();

    doc.fontSize(12).text(`Ride ID: ${ride.id}`);
    doc.text(`Pickup: ${ride.pickup_location}`);
    doc.text(`Drop: ${ride.drop_location}`);
    doc.text(`Fare: ₹${ride.fare}`);
    doc.text(`Status: ${ride.status}`);
    doc.text(`Date: ${new Date(ride.created_at).toLocaleString()}`);

    doc.end();

    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=receipt-${ride.id}.pdf`,
      },
    });

  } catch (error) {

    console.log("Server error:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );

  }
}