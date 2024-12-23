import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("I am listening..");
  const data = await req.json();
  console.log(data);

  return NextResponse.json({ status: "ok" });
}
