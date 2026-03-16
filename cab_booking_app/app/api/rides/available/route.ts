import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {

  try {

    const { data: rides, error } = await supabase
      .from("rides")
      .select("*")
      .eq("status", "requested")
      .order("created_at", { ascending: false });

    if (error) {

      console.error("Supabase error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );

    }

    return NextResponse.json({
      rides: rides || []
    });

  } catch (error) {

    console.error("Server error:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );

  }

}