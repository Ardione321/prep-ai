import { subscriptionWebhook } from "@/backend/controller/payment.controller";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { success } = await subscriptionWebhook(request);

  return NextResponse.json({ success });
}
