import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request){

  const { sessionId } = await req.json();

  await supabase
    .from("payments")
    .update({ status:"paid" })
    .eq("stripe_session_id",sessionId);

  return NextResponse.json({success:true});

}