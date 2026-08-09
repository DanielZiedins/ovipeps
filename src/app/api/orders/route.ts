import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createOrder } from "@/lib/orders";
import type { CreateOrderInput } from "@/lib/orders";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderInput;
    const session = await auth();

    if (!body.email?.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!body.shippingAddress) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 }
      );
    }

    if (!body.items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const order = await createOrder({
      ...body,
      userId: session?.user?.id ?? null,
    });

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      status: order.status,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
