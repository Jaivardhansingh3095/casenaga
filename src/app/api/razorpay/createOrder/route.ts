import { razorpay } from "@/lib/razorpay";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();
    const options = {
      amount,
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    };
    const order = await razorpay.orders.create(options);

    return NextResponse.json(
      {
        orderId: order.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating order: ", error);

    return NextResponse.json(
      { error: "Error creating order" },
      { status: 500 }
    );
  }
}
