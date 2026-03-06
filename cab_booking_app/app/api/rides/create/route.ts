import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const { userId } = await auth();

  if(!userId){
    return NextResponse.json({error:"Not authenticated"})
  }

  const body = await req.json();

  const { pickup, drop, ride_type } = body;

  const { data, error } = await supabase
    .from("rides")
    .insert([
      {
        user_id: userId,
        pickup,
        drop,
        ride_type,
        status: "requested"
      }
    ]);

  if(error){
    return NextResponse.json({error})
  }

  return NextResponse.json({message:"Ride requested",data})

}