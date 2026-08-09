import { db } from "@/lib/db";

interface ClickMeta {
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  landingPage?: string;
}

export async function trackAffiliateClick(code: string, meta: ClickMeta = {}) {
  const normalizedCode = code.trim().toUpperCase();
  if (!normalizedCode) return null;

  const affiliate = await db.affiliateAccount.findFirst({
    where: { code: normalizedCode, status: "ACTIVE" },
  });

  if (!affiliate) return null;

  const [click] = await db.$transaction([
    db.affiliateClick.create({
      data: {
        affiliateId: affiliate.id,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        referrer: meta.referrer,
        landingPage: meta.landingPage,
      },
    }),
    db.affiliateAccount.update({
      where: { id: affiliate.id },
      data: { totalClicks: { increment: 1 } },
    }),
  ]);

  return click;
}

export async function attributeOrder(orderId: string, affiliateCode: string | null | undefined) {
  if (!affiliateCode?.trim()) return null;

  const code = affiliateCode.trim().toUpperCase();
  const affiliate = await db.affiliateAccount.findFirst({
    where: { code, status: "ACTIVE" },
  });

  if (!affiliate) return null;

  const attributionDaysSetting = await db.siteSetting.findUnique({
    where: { key: "affiliate_attribution_days" },
  });
  const attributionDays = Number(attributionDaysSetting?.value ?? 30);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + attributionDays);

  await db.$transaction([
    db.order.update({
      where: { id: orderId },
      data: {
        affiliateCode: code,
        affiliateId: affiliate.id,
      },
    }),
    db.affiliateAttribution.create({
      data: {
        affiliateId: affiliate.id,
        code,
        expiresAt,
        converted: true,
      },
    }),
  ]);

  return affiliate;
}

export async function createCommission(orderId: string) {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { commission: true },
  });

  if (!order?.affiliateId || order.commission) return null;

  const affiliate = await db.affiliateAccount.findUnique({
    where: { id: order.affiliateId },
  });

  if (!affiliate || affiliate.status !== "ACTIVE") return null;

  const commissionableAmount = Math.max(0, order.subtotal - order.discountAmount);
  const commissionRate = affiliate.commissionRate;
  const commissionAmount = Math.round(commissionableAmount * (commissionRate / 100) * 100) / 100;

  const commission = await db.$transaction(async (tx) => {
    const created = await tx.affiliateCommission.create({
      data: {
        affiliateId: affiliate.id,
        orderId: order.id,
        orderNumber: order.orderNumber,
        orderAmount: order.total,
        commissionableAmount,
        commissionRate,
        commissionAmount,
        status: "PENDING",
      },
    });

    await tx.affiliateAccount.update({
      where: { id: affiliate.id },
      data: {
        totalOrders: { increment: 1 },
        pendingEarnings: { increment: commissionAmount },
      },
    });

    return created;
  });

  return commission;
}
