import { NextResponse } from "next/server";
import { generateMonthlyPayout } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const year = Number(body.year);
    const month = Number(body.month);

    if (!year || !month) {
      return NextResponse.json(
        { error: "Year and month are required" },
        { status: 400 }
      );
    }

    const payout = await generateMonthlyPayout(year, month);

    return NextResponse.json({
      id: payout.id,
      periodYear: payout.periodYear,
      periodMonth: payout.periodMonth,
      totalAmount: payout.totalAmount,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate payout";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
