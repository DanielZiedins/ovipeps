import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout | OVIPeps",
  description: "Complete your research peptide order",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-navy-deep">
          Checkout
        </h1>
        <p className="mt-2 text-muted-foreground">
          Enter your shipping details and place your order. Payment via Interac
          e-Transfer.
        </p>
      </div>
      <CheckoutForm />
    </div>
  );
}
