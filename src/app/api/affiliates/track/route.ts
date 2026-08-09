import { NextResponse } from "next/server";
import { z } from "zod";
import { trackAffiliateClick } from "@/lib/affiliate";

const trackSchema = z.object({
  code: z.string().min(1),
  referrer: z.string().optional(),
  landingPage: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = trackSchema.parse(body);

    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      undefined;
    const userAgent = request.headers.get("user-agent") || undefined;

    const click = await trackAffiliateClick(data.code, {
      ipAddress,
      userAgent,
      referrer: data.referrer,
      landingPage: data.landingPage,
    });

    if (!click) {
      return NextResponse.json(
        { error: "Affiliate code not found or inactive." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, clickId: click.id });
  } catch {
    return NextResponse.json(
      { error: "Invalid tracking request." },
      { status: 400 }
    );
  }
}
