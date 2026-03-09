import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: Request) {

  const { rideId, amount } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "Cab Ride Payment",
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
  });

  await supabase.from("payments").insert({
    ride_id: rideId,
    amount: amount,
    stripe_session_id: session.id,
    status: "pending",
  });

  return NextResponse.json({ url: session.url });

}