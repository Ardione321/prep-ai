import { headers } from "next/headers";
import dbConnect from "../config/dbConnect";
import { catchAsyncErrors } from "../middlewares/catchAsyncError";
import stripe from "../utils/stripe";
import User from "../models/user.model";

export const createSubscription = catchAsyncErrors(
  async (email: string, paymentMethodId: string) => {
    await dbConnect();

    const customer = await stripe.customers.create({
      email,
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer?.id,
      items: [{ price: "price_1R1VFrGCuN0BKWpq9EcJDDUy" }],
      expand: ["latest_invoice.payment_intent"],
    });

    return { subscription };
  }
);

export const subscriptionWebhook = async (req: Request) => {
  const rawBody = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.log(error);
  }

  if (!event) {
    throw new Error("Error. Payment event not found!");
  }

  await dbConnect();

  switch (event.type) {
    case "invoice.payment_succeeded":
      const invoice = event.data.object;
      const email = invoice.customer_email;
      const customer = await stripe.customers.retrieve(
        invoice.customer as string
      );

      await User.findOneAndUpdate(
        { email },
        {
          subscription: {
            id: invoice.subscription,
            customerId: customer?.id,
            status: "active",
            created: new Date(invoice.created * 1000),
            startDate: new Date(invoice?.lines?.data[0].period.start * 1000),
            currentPeriodEnd: new Date(
              invoice?.lines?.data[0].period.end * 1000
            ),
          },
        }
      );
      break;
    case "invoice.payment_failed":
      const paymentFailed = event.data.object;
      const nextPaymentAttempt = paymentFailed.next_payment_attempt;

      await User.findOneAndUpdate(
        { "subscription.id": paymentFailed.subscription },
        {
          subscription: {
            status: "past_due",
            nextPaymentAttempt: nextPaymentAttempt
              ? new Date(nextPaymentAttempt * 1000)
              : null,
          },
        }
      );
      break;
    case "customer.subscription.deleted":
      const subscriptionDeleted = event.data.object;

      await User.findOneAndUpdate(
        { "subscription.id": subscriptionDeleted.id },
        {
          subscription: {
            status: "cancelled",
            nextPaymentAttempt: null,
          },
        }
      );
      break;
    default:
      break;
  }

  return { success: true };
};
