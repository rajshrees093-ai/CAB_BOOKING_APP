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

    // get supabase user uuid
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

    // fetch ride belonging to this user
    const { data: ride, error } = await supabase
      .from("rides")
      .select("*")
      .eq("id", rideId)
      .eq("rider_id", user.id)
      .single();

    if (error || !ride) {
      return NextResponse.json(
        { error: "Ride not found" },
        { status: 404 }
      );
    }

    // generate pdf
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

    console.log(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );

  }
}