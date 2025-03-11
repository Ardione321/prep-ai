"use server";

import { createSubscription } from "@/backend/controller/payment.controller";

export async function createNewSubscription(
  email: string,
  paymentMethodId: string
) {
  return await createSubscription(email, paymentMethodId);
}
