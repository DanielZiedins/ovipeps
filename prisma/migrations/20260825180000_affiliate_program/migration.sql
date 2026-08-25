-- Expand the signed Canadian affiliate application.
ALTER TABLE "AffiliateApplication" ADD COLUMN "firstName" TEXT;
ALTER TABLE "AffiliateApplication" ADD COLUMN "lastName" TEXT;
ALTER TABLE "AffiliateApplication" ADD COLUMN "phone" TEXT;
ALTER TABLE "AffiliateApplication" ADD COLUMN "address1" TEXT;
ALTER TABLE "AffiliateApplication" ADD COLUMN "address2" TEXT;
ALTER TABLE "AffiliateApplication" ADD COLUMN "city" TEXT;
ALTER TABLE "AffiliateApplication" ADD COLUMN "province" TEXT;
ALTER TABLE "AffiliateApplication" ADD COLUMN "postalCode" TEXT;
ALTER TABLE "AffiliateApplication" ADD COLUMN "country" TEXT NOT NULL DEFAULT 'Canada';
ALTER TABLE "AffiliateApplication" ADD COLUMN "canadianResident" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "AffiliateApplication" ADD COLUMN "socialProfiles" JSONB;
ALTER TABLE "AffiliateApplication" ADD COLUMN "whyAffiliate" TEXT;
ALTER TABLE "AffiliateApplication" ADD COLUMN "affiliateStrengths" TEXT;
ALTER TABLE "AffiliateApplication" ADD COLUMN "monthlyMinimumAccepted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "AffiliateApplication" ADD COLUMN "complianceAccepted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "AffiliateApplication" ADD COLUMN "signedName" TEXT;
ALTER TABLE "AffiliateApplication" ADD COLUMN "signedAt" DATETIME;
ALTER TABLE "AffiliateApplication" ADD COLUMN "agreementVersion" TEXT;

-- Store one monthly row per affiliate and a complete manual-payment audit trail.
ALTER TABLE "AffiliatePayoutItem" ADD COLUMN "commissionIds" JSONB;
ALTER TABLE "AffiliatePayoutItem" ADD COLUMN "paymentMethod" TEXT;
ALTER TABLE "AffiliatePayoutItem" ADD COLUMN "paymentAmount" REAL;
ALTER TABLE "AffiliatePayoutItem" ADD COLUMN "paidBy" TEXT;
