import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

const schema = z.object({ status: z.enum(["ACTIVE", "SUSPENDED", "INACTIVE"]) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const { status } = schema.parse(await request.json());
    await db.affiliateAccount.update({ where: { id }, data: { status } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update affiliate status";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
