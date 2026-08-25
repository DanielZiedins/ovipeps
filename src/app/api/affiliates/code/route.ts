import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAffiliate } from "@/lib/auth";
import { db } from "@/lib/db";

const RESERVED_CODES = new Set(["OVIPEPS", "ADMIN", "SUPPORT", "HELP", "ORDER", "ORDERS", "SHOP", "CANADA"]);
const schema = z.object({
  code: z.string().trim().min(4, "Use at least 4 characters").max(24, "Use no more than 24 characters").regex(/^[A-Za-z0-9-]+$/, "Use only letters, numbers, and hyphens"),
});

export async function POST(request: Request) {
  const session = await requireAffiliate();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { code: submittedCode } = schema.parse(await request.json());
    const code = submittedCode.toUpperCase();
    if (RESERVED_CODES.has(code)) return NextResponse.json({ error: "That code is reserved. Please choose another." }, { status: 400 });

    const account = await db.affiliateAccount.findUnique({ where: { userId: session.user.id } });
    if (!account) return NextResponse.json({ error: "Affiliate account not found." }, { status: 404 });
    if (!account.code.startsWith("PENDING-")) return NextResponse.json({ error: "Your affiliate code has already been created." }, { status: 409 });

    const existing = await db.affiliateAccount.findUnique({ where: { code } });
    if (existing) return NextResponse.json({ error: "That code is already in use. Please choose another." }, { status: 409 });

    await db.affiliateAccount.update({ where: { id: account.id }, data: { code } });
    return NextResponse.json({ success: true, code });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message ?? "Please choose a valid code." }, { status: 400 });
    console.error("Affiliate code setup failed", error);
    return NextResponse.json({ error: "We could not save that code. Please try another." }, { status: 409 });
  }
}
