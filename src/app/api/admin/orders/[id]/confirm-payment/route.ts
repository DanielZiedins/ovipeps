import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { confirmPayment } from "@/lib/orders";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const order = await confirmPayment(id, {
      confirmedBy: session.user.id,
    });

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to confirm payment";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
