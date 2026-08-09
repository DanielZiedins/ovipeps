import { NextResponse } from "next/server";
import { markPayoutItemPaid } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const paymentReference =
      typeof body.paymentReference === "string"
        ? body.paymentReference
        : undefined;

    await markPayoutItemPaid(id, paymentReference);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to mark payout as paid";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
