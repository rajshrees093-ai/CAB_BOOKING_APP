import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {

  try {

    const { data: rides, error } = await supabase
      .from("rides")
      .select("*")
      .eq("status", "requested")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      rides
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );

  }

}