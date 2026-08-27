-- Tiered affiliate commissions, customer discounts, and monthly status tracking.
ALTER TABLE "AffiliateAccount" ADD COLUMN "missedMinimumMonths" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "AffiliateAccount" ADD COLUMN "minimumTrackingStartedAt" DATETIME;
ALTER TABLE "AffiliateAccount" ADD COLUMN "frozenAt" DATETIME;
UPDATE "AffiliateAccount"
SET "minimumTrackingStartedAt" = CURRENT_TIMESTAMP
WHERE "minimumTrackingStartedAt" IS NULL;

ALTER TABLE "AffiliatePayoutItem" ADD COLUMN "commissionRate" REAL NOT NULL DEFAULT 15;

CREATE TABLE "AffiliateMonthlyPerformance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "affiliateId" TEXT NOT NULL,
    "periodYear" INTEGER NOT NULL,
    "periodMonth" INTEGER NOT NULL,
    "qualifyingSales" REAL NOT NULL DEFAULT 0,
    "commissionRate" REAL NOT NULL DEFAULT 10,
    "commissionOwed" REAL NOT NULL DEFAULT 0,
    "minimumMet" BOOLEAN NOT NULL DEFAULT false,
    "missedMinimumCount" INTEGER NOT NULL DEFAULT 0,
    "evaluatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AffiliateMonthlyPerformance_affiliateId_fkey"
      FOREIGN KEY ("affiliateId") REFERENCES "AffiliateAccount" ("id")
      ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "AffiliateMonthlyPerformance_affiliateId_periodYear_periodMonth_key"
ON "AffiliateMonthlyPerformance"("affiliateId", "periodYear", "periodMonth");

CREATE INDEX "AffiliateMonthlyPerformance_periodYear_periodMonth_idx"
ON "AffiliateMonthlyPerformance"("periodYear", "periodMonth");
