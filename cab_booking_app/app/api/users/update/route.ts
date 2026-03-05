import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();

  const body = await req.json();

  const { name, phone } = body;

  const { data, error } = await supabase
    .from("users")
    .update({
      name,
      phone,
    })
    .eq("clerk_id", userId);

  if (error) {
    return NextResponse.json({ error });
  }

  return NextResponse.json(data);
}