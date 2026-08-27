import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
if (!url) {
  console.log("No production database configured; affiliate schema check skipped.");
  process.exit(0);
}

const client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
const additions = {
  AffiliateApplication: [
    ["firstName", "TEXT"], ["lastName", "TEXT"], ["phone", "TEXT"],
    ["address1", "TEXT"], ["address2", "TEXT"], ["city", "TEXT"],
    ["province", "TEXT"], ["postalCode", "TEXT"],
    ["country", "TEXT NOT NULL DEFAULT 'Canada'"],
    ["canadianResident", "BOOLEAN NOT NULL DEFAULT false"],
    ["socialProfiles", "JSONB"], ["whyAffiliate", "TEXT"],
    ["affiliateStrengths", "TEXT"],
    ["monthlyMinimumAccepted", "BOOLEAN NOT NULL DEFAULT false"],
    ["complianceAccepted", "BOOLEAN NOT NULL DEFAULT false"],
    ["signedName", "TEXT"], ["signedAt", "DATETIME"],
    ["agreementVersion", "TEXT"],
  ],
  AffiliatePayoutItem: [
    ["commissionIds", "JSONB"], ["paymentMethod", "TEXT"],
    ["paymentAmount", "REAL"], ["paidBy", "TEXT"],
    ["commissionRate", "REAL NOT NULL DEFAULT 15"],
  ],
  AffiliateAccount: [
    ["missedMinimumMonths", "INTEGER NOT NULL DEFAULT 0"],
    ["minimumTrackingStartedAt", "DATETIME"],
    ["frozenAt", "DATETIME"],
  ],
};

async function ensureColumns(table, columns) {
  const info = await client.execute(`PRAGMA table_info("${table}")`);
  const existing = new Set(info.rows.map((row) => String(row.name)));
  for (const [name, definition] of columns) {
    if (existing.has(name)) continue;
    try {
      await client.execute(`ALTER TABLE "${table}" ADD COLUMN "${name}" ${definition}`);
    } catch (error) {
      if (!String(error).toLowerCase().includes("duplicate column")) throw error;
    }
  }
}

try {
  for (const [table, columns] of Object.entries(additions)) await ensureColumns(table, columns);
  await client.execute(`UPDATE "AffiliateAccount" SET "minimumTrackingStartedAt" = CURRENT_TIMESTAMP WHERE "minimumTrackingStartedAt" IS NULL`);
  await client.execute(`CREATE TABLE IF NOT EXISTS "AffiliateMonthlyPerformance" (
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
    FOREIGN KEY ("affiliateId") REFERENCES "AffiliateAccount" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`);
  await client.execute(`CREATE UNIQUE INDEX IF NOT EXISTS "AffiliateMonthlyPerformance_affiliateId_periodYear_periodMonth_key" ON "AffiliateMonthlyPerformance"("affiliateId", "periodYear", "periodMonth")`);
  await client.execute(`CREATE INDEX IF NOT EXISTS "AffiliateMonthlyPerformance_periodYear_periodMonth_idx" ON "AffiliateMonthlyPerformance"("periodYear", "periodMonth")`);
  await client.execute(`UPDATE "SiteSetting" SET "value" = '10' WHERE "key" = 'affiliate_default_commission'`);
  console.log("Affiliate database schema is ready.");
} finally {
  client.close();
}
