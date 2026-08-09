import { NextResponse } from "next/server";
import { approveAffiliateApplication } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";

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
    const result = await approveAffiliateApplication(id, session.user.id);

    return NextResponse.json({ success: true, code: result.code });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to approve application";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
