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
  console.log("Affiliate database schema is ready.");
} finally {
  client.close();
}
