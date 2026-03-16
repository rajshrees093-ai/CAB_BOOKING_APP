import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {

  const { data: rides, error } = await supabase
    .from("rides")
    .select("*")
    .eq("status", "requested")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message });
  }

  return NextResponse.json({ rides });

}