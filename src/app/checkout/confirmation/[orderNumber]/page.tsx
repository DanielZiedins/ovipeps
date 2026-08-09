import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Banknote, CheckCircle2, Package } from "lucide-react";
import { PaymentReferenceForm } from "@/components/checkout/payment-reference-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getOrderByNumber } from "@/lib/orders";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ConfirmationPageProps {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({
  params,
}: ConfirmationPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Order ${orderNumber} | OVIPeps`,
    description: "Order confirmation and payment instructions",
  };
}

async function getEtransferSettings() {
  const settings = await db.siteSetting.findMany({
    where: {
      key: { in: ["etransfer_email", "etransfer_instructions"] },
    },
  });

  return {
    email:
      settings.find((s) => s.key === "etransfer_email")?.value ??
      "orders@ovipeps.ca",
    instructions:
      settings.find((s) => s.key === "etransfer_instructions")?.value ??
      "Please send your Interac e-Transfer and include your order number in the message field.",
  };
}

function formatShippingAddress(address: unknown) {
  if (!address || typeof address !== "object") return null;
  const addr = address as Record<string, string>;
  const lines = [
    `${addr.firstName ?? ""} ${addr.lastName ?? ""}`.trim(),
    addr.address1,
    addr.address2,
    `${addr.city ?? ""}, ${addr.province ?? ""} ${addr.postalCode ?? ""}`,
    addr.country === "CA" ? "Canada" : addr.country,
    addr.phone,
  ].filter(Boolean);
  return lines;
}

export default async function OrderConfirmationPage({
  params,
}: ConfirmationPageProps) {
  const { orderNumber } = await params;
  const [order, etransfer] = await Promise.all([
    getOrderByNumber(orderNumber),
    getEtransferSettings(),
  ]);

  if (!order) {
    notFound();
  }

  const shippingLines = formatShippingAddress(order.shippingAddress);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-7 w-7 text-success" />
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-navy-deep">
          Order Confirmed
        </h1>
        <p className="mt-2 text-muted-foreground">
          Thank you for your order. Complete your Interac e-Transfer to begin
          processing.
        </p>
        <p className="mt-1 font-mono text-sm text-navy">{order.orderNumber}</p>
      </div>

      <div className="space-y-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-navy" />
              <CardTitle>Interac e-Transfer Instructions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Send payment to</p>
              <p className="mt-1 text-lg font-semibold text-navy">
                {etransfer.email}
              </p>
              <p className="mt-3 text-sm text-foreground">
                Amount:{" "}
                <span className="font-semibold">
                  {formatCurrency(order.total, order.currency)}
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Order number:{" "}
                <span className="font-mono text-foreground">
                  {order.orderNumber}
                </span>
              </p>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {etransfer.instructions}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              After sending your e-Transfer, save the reference or message you
              used so we can match your payment faster.
            </p>
            <PaymentReferenceForm
              orderNumber={order.orderNumber}
              initialReference={order.paymentReference}
            />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-navy" />
                <CardTitle>Order Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">
                <p className="text-muted-foreground">Order date</p>
                <p className="font-medium">{formatDate(order.createdAt)}</p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{order.email}</p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">Status</p>
                <p className="font-medium capitalize">
                  {order.status.replace(/_/g, " ").toLowerCase()}
                </p>
              </div>
              <ul className="space-y-3 border-t border-border pt-4">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between gap-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-muted-foreground">
                        {item.variantName} × {item.quantity}
                      </p>
                    </div>
                    <span className="shrink-0 font-medium">
                      {formatCurrency(item.totalPrice)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="space-y-1 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {order.shippingAmount === 0
                      ? "Free"
                      : formatCurrency(order.shippingAmount)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 text-base font-semibold">
                  <span>Total</span>
                  <span className="text-navy">
                    {formatCurrency(order.total, order.currency)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              {shippingLines ? (
                <address className="space-y-0.5 text-sm not-italic text-foreground">
                  {shippingLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </address>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No shipping address on file.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link
            href="/shop"
            className="text-sm font-medium text-navy hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
