import dbConnect from "../config/dbConnect";
import { catchAsyncErrors } from "../middlewares/catchAsyncError";
import stripe from "../utils/stripe";

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

    const subcription = await stripe.subscriptions.create({
      customer: customer?.id,
      items: [{ price: "price_1R1VFrGCuN0BKWpq9EcJDDUy" }],
      expand: ["latest_invoice.payment_intent"],
    });

    return { subcription };
  }
);
