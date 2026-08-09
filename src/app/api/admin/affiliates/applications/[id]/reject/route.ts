import { NextResponse } from "next/server";
import { rejectAffiliateApplication } from "@/lib/admin";
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
    const reviewNotes =
      typeof body.reviewNotes === "string" ? body.reviewNotes : undefined;

    await rejectAffiliateApplication(id, session.user.id, reviewNotes);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to reject application";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
