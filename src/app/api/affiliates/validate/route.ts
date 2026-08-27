import { NextResponse } from "next/server";
import { resolveActiveAffiliate } from "@/lib/affiliate";
import { AFFILIATE_CUSTOMER_DISCOUNT_RATE } from "@/lib/affiliate-program";

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code");
  const affiliate = await resolveActiveAffiliate(code);

  if (!affiliate) {
    return NextResponse.json(
      { valid: false, error: "Affiliate code not found or inactive." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    valid: true,
    code: affiliate.code,
    discountRate: AFFILIATE_CUSTOMER_DISCOUNT_RATE,
  });
}
