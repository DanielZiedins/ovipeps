import { NextResponse } from "next/server";
import { getOrderByNumber, updatePaymentReference } from "@/lib/orders";

interface RouteContext {
  params: Promise<{ orderNumber: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { orderNumber } = await context.params;
  const order = await getOrderByNumber(orderNumber);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}

export async function PATCH(request: Request, context: RouteContext) {
  const { orderNumber } = await context.params;

  try {
    const body = (await request.json()) as { paymentReference?: string };

    if (!body.paymentReference?.trim()) {
      return NextResponse.json(
        { error: "Payment reference is required" },
        { status: 400 }
      );
    }

    const order = await updatePaymentReference(
      orderNumber,
      body.paymentReference
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: "Failed to update payment reference" },
      { status: 400 }
    );
  }
}
