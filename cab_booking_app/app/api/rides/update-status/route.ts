import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req:Request){

  const { rideId,status } = await req.json();

  const {error} = await supabase
    .from("rides")
    .update({ status })
    .eq("id",rideId);

  if(error){
    return NextResponse.json({error:error.message},{status:500});
  }

  return NextResponse.json({message:"Status updated"});
}