"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Banknote, Loader2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const CANADIAN_PROVINCES = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
] as const;

const SHIPPING_THRESHOLD = 300;
const FLAT_SHIPPING_RATE = 15;

const checkoutSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address1: z.string().min(1, "Street address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  province: z.enum(
    CANADIAN_PROVINCES.map((p) => p.value) as [string, ...string[]],
    { message: "Select a province" }
  ),
  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .regex(
      /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
      "Enter a valid Canadian postal code"
    ),
  phone: z.string().optional(),
  affiliateCode: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const items = useCartStore((s) => s.items);
  const discountCode = useCartStore((s) => s.discountCode);
  const affiliateCode = useCartStore((s) => s.affiliateCode);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore((s) => s.subtotal);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      affiliateCode: affiliateCode ?? "",
    },
  });

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (affiliateCode) {
      setValue("affiliateCode", affiliateCode);
    }
  }, [affiliateCode, setValue]);

  const totals = useMemo(() => {
    const cartSubtotal = subtotal();
    const shippingAmount =
      cartSubtotal >= SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE;
    const total = cartSubtotal + shippingAmount;
    return { cartSubtotal, shippingAmount, total };
  }, [items, subtotal]);

  const onSubmit = async (values: CheckoutFormValues) => {
    if (!items.length) {
      setSubmitError("Your cart is empty");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          shippingAddress: {
            firstName: values.firstName,
            lastName: values.lastName,
            address1: values.address1,
            address2: values.address2 || undefined,
            city: values.city,
            province: values.province,
            postalCode: values.postalCode.toUpperCase(),
            country: "CA",
            phone: values.phone || undefined,
          },
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          discountCode,
          affiliateCode: values.affiliateCode || affiliateCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to place order");
      }

      clearCart();
      router.push(`/checkout/confirmation/${data.orderNumber}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to place order"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-16 text-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            Your cart is empty
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add items to your cart before checking out.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="mt-6"
            onClick={() => router.push("/shop")}
          >
            Continue Shopping
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="First name"
                autoComplete="given-name"
                error={errors.firstName?.message}
                {...register("firstName")}
              />
              <Input
                label="Last name"
                autoComplete="family-name"
                error={errors.lastName?.message}
                {...register("lastName")}
              />
            </div>
            <Input
              label="Address"
              autoComplete="address-line1"
              error={errors.address1?.message}
              {...register("address1")}
            />
            <Input
              label="Apartment, suite, etc. (optional)"
              autoComplete="address-line2"
              error={errors.address2?.message}
              {...register("address2")}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="City"
                autoComplete="address-level2"
                error={errors.city?.message}
                {...register("city")}
              />
              <Select
                label="Province"
                autoComplete="address-level1"
                error={errors.province?.message}
                defaultValue=""
                {...register("province")}
              >
                <option value="" disabled>
                  Select province
                </option>
                {CANADIAN_PROVINCES.map((province) => (
                  <option key={province.value} value={province.value}>
                    {province.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Postal code"
                autoComplete="postal-code"
                placeholder="A1A 1A1"
                error={errors.postalCode?.message}
                {...register("postalCode")}
              />
              <Input
                label="Phone (optional)"
                type="tel"
                autoComplete="tel"
                error={errors.phone?.message}
                {...register("phone")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-navy" />
              <div>
                <p className="font-medium text-foreground">Interac e-Transfer</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  After placing your order, you&apos;ll receive instructions to
                  send payment via Interac e-Transfer. Your order will be
                  processed once payment is confirmed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Referral Code (optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              label="Affiliate / referral code"
              placeholder="Enter code"
              hint="If you were referred by a partner, enter their code here."
              error={errors.affiliateCode?.message}
              {...register("affiliateCode")}
            />
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.variantId}
                  className="flex items-start justify-between gap-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-muted-foreground">{item.variantName}</p>
                    <p className="text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="shrink-0 font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(totals.cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {totals.shippingAmount === 0
                    ? "Free"
                    : formatCurrency(totals.shippingAmount)}
                </span>
              </div>
              {totals.cartSubtotal < SHIPPING_THRESHOLD && (
                <p className="text-xs text-muted-foreground">
                  Free shipping on orders over {formatCurrency(SHIPPING_THRESHOLD)}
                </p>
              )}
              <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                <span>Total</span>
                <span className="text-navy">{formatCurrency(totals.total)}</span>
              </div>
              <p className="text-xs text-muted-foreground">All prices in CAD</p>
            </div>

            {submitError && (
              <p className="rounded-md bg-error/10 px-3 py-2 text-sm text-error">
                {submitError}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Placing Order...
                </>
              ) : (
                "Place Order"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
