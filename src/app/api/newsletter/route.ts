import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) return NextResponse.json({ error: "Newsletter is not configured" }, { status: 503 });
  const { error } = await new Resend(apiKey).contacts.create({ audienceId, email: parsed.data.email.toLowerCase(), unsubscribed: false });
  if (error) return NextResponse.json({ error: "Unable to subscribe" }, { status: 502 });
  return NextResponse.json({ success: true });
}
